import React, { useState, useEffect } from "react";
import { Header } from "@/components/shared/header/index";
import {Order_Status, orderMenu} from "../../common/constants/menu-order.ts";
import {OrderApi} from "../../service/order/order.ts";
import {Pagination} from "../../components/ui";
import {encryptAmount} from "../../utils/encryptAmount.ts";
import {key} from "../../environment.ts";
import {PaymentApi} from "../../service/payment/payment.ts";
import {toast} from "react-toastify";
import {Button, Input, message, Modal, Rate} from "antd";
import {ReviewApi} from "../../service/review/review.ts";
import {formatMoney} from "../../utils";
import { Icon } from '@iconify/react/dist/iconify.js';
import './index.scss';

// Định nghĩa kiểu dữ liệu cho Product và Order
interface Product {
    id: string;
    image: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    products: Product[];
    total: number;
    status: string;
    buyer: string;
    orderTime: string;
    statusTime: string;
    address: string;
}

interface Orders {
    [key: string]: Order[];
}

type OrderCategory =
    | "Đơn hàng chờ xác nhận"
    | "Đơn hàng chờ vận chuyển"
    | "Đơn hàng đang giao"
    | "Đơn hàng giao thành công"
    | "Đơn hàng đã hủy"
    | "Đơn hàng đã hoàn"
    | "Đơn hàng đang hoàn";

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Orders>({
        "Đơn hàng chờ xác nhận": [
            {
                id: "123",
                products: [
                    {
                        id: "p1",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "DRCEUTICS Dung Dịch Loại Bỏ Tế Bào 100ml",
                        color: "Trắng",
                        size: "L",
                        quantity: 1,
                        price: 108000,
                    },
                    {
                        id: "p2",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "Sản phẩm phụ kiện",
                        color: "Xanh",
                        size: "M",
                        quantity: 2,
                        price: 50000,
                    },
                ],
                total: 208000,
                status: "Chờ xác nhận",
                buyer: "Nguyễn Văn A",
                orderTime: "19/11/2024, 10:30",
                statusTime: "20/11/2024, 10:30",
                address: "123 Đường ABC, Hà Nội"
            },
            {
                id: "124",
                products: [
                    {
                        id: "p1",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "DRCEUTICS Dung Dịch Loại Bỏ Tế Bào 100ml",
                        color: "Trắng",
                        size: "L",
                        quantity: 1,
                        price: 108000,
                    },
                ],
                total: 108000,
                status: "Chờ xác nhận",
                buyer: "Nguyễn Văn B",
                orderTime: "19/11/2024, 11:00",
                statusTime: "20/11/2024, 11:00",
                address: "456 Đường XYZ, Hà Nội"
            },
        ],
        "Đơn hàng chờ vận chuyển": [
            {
                id: "125",
                products: [
                    {
                        id: "p3",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "Sản phẩm B",
                        color: "Đen",
                        size: "XL",
                        quantity: 1,
                        price: 180000,
                    },
                ],
                total: 180000,
                status: "Chờ vận chuyển",
                buyer: "Trần Thị B",
                orderTime: "20/11/2024, 13:30",
                statusTime: "21/11/2024, 13:30",
                address: "789 Đường PQR, Đà Nẵng"
            },
        ],
        "Đơn hàng đang giao": [
            {
                id: "128",
                products: [
                    {
                        id: "p6",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "Sản phẩm E",
                        color: "Xanh lá",
                        size: "L",
                        quantity: 2,
                        price: 250000,
                    },
                ],
                total: 500000,
                status: "Đang giao",
                buyer: "Vũ Thị E",
                orderTime: "22/11/2024, 10:45",
                statusTime: "23/11/2024, 10:45",
                address: "202 Đường MNO, Hà Nội"
            },
        ],
        "Đơn hàng giao thành công": [
            {
                id: "129",
                products: [
                    {
                        id: "p7",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "Sản phẩm F",
                        color: "Hồng",
                        size: "XL",
                        quantity: 1,
                        price: 300000,
                    },
                ],
                total: 300000,
                status: "Giao thành công",
                buyer: "Trần Thị F",
                orderTime: "22/11/2024, 09:00",
                statusTime: "25/11/2024, 09:00",
                address: "303 Đường DEF, TP.HCM"
            },
            {
                id: "1293",
                products: [
                    {
                        id: "p75",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "Sản phẩm FF",
                        color: "Hồng",
                        size: "XLL",
                        quantity: 1,
                        price: 300000,
                    },
                ],
                total: 300000,
                status: "Giao thành công",
                buyer: "Trần Thị F",
                orderTime: "10/11/2024, 09:00",
                statusTime: "15/11/2024, 09:00",
                address: "303 Đường DEF, TP.HCM"
            },
        ],
        "Đơn hàng đang hoàn": [
            {
                id: "135",
                products: [
                    {
                        id: "p10",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "Sản phẩm I",
                        color: "Đỏ",
                        size: "M",
                        quantity: 2,
                        price: 250000,
                    },
                ],
                total: 500000,
                status: "Đang hoàn",
                buyer: "Lê Thị I",
                orderTime: "15/11/2024, 14:30",
                statusTime: "17/11/2024, 14:30",
                address: "808 Đường XYZ, Hà Nội"
            },
        ],

        "Đơn hàng đã hủy": [
            {
                id: "130",
                products: [
                    {
                        id: "p8",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "Sản phẩm G",
                        color: "Tím",
                        size: "M",
                        quantity: 1,
                        price: 350000,
                    },
                ],
                total: 350000,
                status: "Đã hủy",
                buyer: "Hoàng Thị G",
                orderTime: "25/11/2024, 12:00",
                statusTime: "26/11/2024, 12:00",
                address: "404 Đường UVW, Hà Nội"
            },
        ],
        "Đơn hàng đã hoàn": [
            {
                id: "131",
                products: [
                    {
                        id: "p9",
                        image: "https://cdn.kkfashion.vn/26926-large_default/ao-thun-nu-mau-den-in-hinh-buom-asm16-35.jpg",
                        name: "Sản phẩm H",
                        color: "Xám",
                        size: "M",
                        quantity: 1,
                        price: 400000,
                    },
                ],
                total: 400000,
                status: "Đã hoàn",
                buyer: "Phan Thị H",
                orderTime: "26/11/2024, 08:30",
                statusTime: "26/11/2024, 08:30",
                address: "505 Đường KLM, Đà Nẵng"
            },
        ],


    });
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [status,setStatus]=useState(orderMenu[0].active)
    const [orderList,setOrderList]=useState([])
    const [productReview,setProductReview]=useState(null)
    const [hasEdit,setHasEdit]=useState<boolean>(false)
    useEffect(() => {
        const fetchData= async ()=>{
            try{
                const response =await OrderApi.getByStatus({status,page,limit:10})
                if(response?.data?.isSuccess){
                    setOrderList(response?.data?.data?.content||[])
                    setTotalPage(response?.data?.data?.totalPages||0)
                }
                else{
                    setOrderList([])
                    setTotalPage(0)
                }
            }catch(e){
                setOrderList([])
                setTotalPage(0)
                console.log(e)
            }
        }
        fetchData()
    }, [page,status]);



    const [selectedCategory, setSelectedCategory] = useState(orderMenu[0]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [isModalOpenReview, setIsModalOpenReview] = useState(false);
    useEffect(() => {
        const firstOrder = orders[selectedCategory]?.[0] ?? null;
        setSelectedOrder(firstOrder);
    }, [selectedCategory, orders]);
    useEffect(() => {
        if(isModalOpenReview && productReview?.product_id) {
            const fetchDataReviewUpdate = async (id) => {
                try {
                    const rsp = await ReviewApi.getReviewUpdate({productId: id})
                    setReviewText(rsp?.data?.data?.content||"")
                    setRating(rsp?.data?.data?.value||0)
                    setHasEdit(true)
                } catch (e) {
                    console.log(e)
                    setHasEdit(false)
                }
            }
            fetchDataReviewUpdate(productReview?.product_id)
        }

    }, [isModalOpenReview, productReview]);

    const handleCategoryClick = (category:  {     id: number  ;  name: string ;    active: string }) => {
        setSelectedCategory(category);
        setStatus(category.active)
    };

    const handleOrderAction = (orderId: string, action: string) => {
        let updatedOrders = { ...orders };
        let orderToUpdate: Order | undefined;
        let currentCategory = "";

        Object.keys(updatedOrders).forEach((category) => {
            const orderIndex = updatedOrders[category as OrderCategory].findIndex((order) => order.id === orderId);
            if (orderIndex !== -1) {
                currentCategory = category;
                orderToUpdate = updatedOrders[category as OrderCategory].splice(orderIndex, 1)[0];
            }
        });

        if (orderToUpdate) {
            switch (action) {
                case "cancel":
                    if (currentCategory === "Đơn hàng chờ xác nhận") {
                        orderToUpdate.status = "Đã hủy";
                        updatedOrders["Đơn hàng đã hủy"].push(orderToUpdate);
                    }
                    break;
                case "return":
                    if (currentCategory === "Đơn hàng giao thành công") {
                        orderToUpdate.status = "Đang hoàn";
                        updatedOrders["Đơn hàng đang hoàn"].push(orderToUpdate);
                    }
                    break;
                default:
                    break;
            }
        }

        setOrders(updatedOrders);
    };

    const openModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };
    // Hàm kiểm tra nếu thời gian giao hàng đã quá 10 ngày
    const isOrderOver10Days = (order: Order) => {
        const deliveryDate = new Date(convertToISODate(order.statusTime)); // Sử dụng hàm convertToISODate để chuẩn hóa ngày
        const currentDate = new Date();
        const diffTime = currentDate.getTime() - deliveryDate.getTime(); // Tính chênh lệch thời gian
        const diffDays = diffTime / (1000 * 3600 * 24); // Chuyển đổi từ milliseconds sang ngày
        return diffDays > 10; // Kiểm tra nếu vượt quá 10 ngày
    };



    const convertToISODate = (dateString: string): string => {
        const parts = dateString.split(","); // Tách ngày tháng và giờ
        if (parts.length === 2) {
            const dateParts = parts[0].split("/"); // Tách ngày, tháng, năm
            const time = parts[1].trim(); // Lấy giờ

            if (dateParts.length === 3) {
                const [day, month, year] = dateParts;
                // Định dạng ngày thành ISO
                const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}:00`;
                return formattedDate;
            }
        }
        return dateString; // Nếu không thể phân tách đúng, trả về nguyên bản
    };
    const handlePay=async(orderId,amount)=>{
        const amountHash=amount
            // encryptAmount(amount,key.amountKey);
        try{
           const rsp = await PaymentApi.create({amount:amountHash,orderId,bankCode:'NCB'})
            if(rsp?.data?.isSuccess){
                if(rsp?.data?.data?.paymentUrl){
                    window.location.href=rsp?.data?.data?.paymentUrl
                }
                else{

                    toast.error("Thanh toán thất bại vui lòng thử lại!")
                }
            }
            else{
                toast.error("Thanh toán thất bại vui lòng thử lại!")
            }
        }catch(e){
            toast.error("Thanh toán thất bại vui lòng thử lại!")
            console.log(e)
        }
    }
    const handleCancel=async(params)=>{
        try {
            await OrderApi.cancelOrder(params);
            setOrderList(prev=>prev?.filter(item=>item.id!==params.id))
            toast.success("Hủy đơn hàng thành công")
        }catch(e){
            console.log(e)
            message.error("Hủy đơn hàng thất bại vui lòng thử lại sau!");
        }
    }


    const handleOpenModalReview = (product) => {
        setProductReview(product)
        setIsModalOpenReview(true);
    };

    const handleCloseModal = () => {
        setIsModalOpenReview(false);
        setRating(0); // Reset rating
        setReviewText(""); // Reset nội dung đánh giá
        setProductReview(null)
    };
    const handleSubmit = async () => {
        if (rating === 0 || reviewText.trim() === "") {
            message.error('Vui lòng nhập số sao và đánh giá sản phẩm.');
            return;
        }

        const reviewData = {
            value: rating,
            content: reviewText, // Đổi tên thành content
            product_id: productReview.product_id
        };

        try {
            if(hasEdit){
                const rsp = await ReviewApi.update(reviewData);
                message.success('Đánh giá đã được cập nhật thành công!');
                handleCloseModal();
            }
            else{
                const rsp = await ReviewApi.create(reviewData);
                message.success('Đánh giá đã được gửi thành công!');
                handleCloseModal();
            }

        } catch (e) {
            console.log(e);
            message.error('Không thể gửi đánh giá: ' + e.message);
        }
    };
    const getStatusBadgeClass = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'CHO_XAC_NHAN': 'orders-modern__status--pending',
            'CHO_VAN_CHUYEN': 'orders-modern__status--processing',
            'DANG_GIAO': 'orders-modern__status--shipping',
            'GIAO_HANG_THANH_CONG': 'orders-modern__status--success',
            'HUY_HANG': 'orders-modern__status--cancelled',
        };
        return statusMap[status] || '';
    };

    const getStatusIcon = (status: string) => {
        const iconMap: { [key: string]: string } = {
            'CHO_XAC_NHAN': 'solar:clock-circle-bold-duotone',
            'CHO_VAN_CHUYEN': 'solar:box-bold-duotone',
            'DANG_GIAO': 'solar:delivery-bold-duotone',
            'GIAO_HANG_THANH_CONG': 'solar:check-circle-bold-duotone',
            'HUY_HANG': 'solar:close-circle-bold-duotone',
        };
        return iconMap[status] || 'solar:document-bold-duotone';
    };

    return (
        <div className="orders-modern">
            <Header />
            <div className="orders-modern__container">
                {/* Sidebar */}
                <div className="orders-modern__sidebar">
                    <div className="orders-modern__sidebar-header">
                        <Icon icon="solar:list-bold-duotone" />
                        <h3>Danh mục đơn hàng</h3>
                    </div>
                    <ul className="orders-modern__menu">
                        {orderMenu.map((category) => (
                            <li
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className={`orders-modern__menu-item ${selectedCategory === category ? 'active' : ''}`}
                            >
                                <Icon icon={getStatusIcon(category.active)} />
                                <span>{category.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content */}
                <div className="orders-modern__content">
                    <div className="orders-modern__header">
                        <h1 className="orders-modern__title">
                            <Icon icon="solar:document-text-bold-duotone" />
                            {selectedCategory.name}
                        </h1>
                        <p className="orders-modern__subtitle">
                            {orderList?.length || 0} đơn hàng
                        </p>
                    </div>

                    <div className="orders-modern__list">
                        {orderList?.length > 0 ? (
                            orderList.map((order) => (
                                <div key={order.id} className="orders-modern__card">
                                    <div className="orders-modern__card-header">
                                        <div className="orders-modern__card-info">
                                            <div className="orders-modern__order-id">
                                                <Icon icon="solar:hashtag-bold" />
                                                Đơn hàng #{order.id}
                                            </div>
                                            <div className="orders-modern__order-date">
                                                <Icon icon="solar:calendar-bold" />
                                                {new Date(convertToISODate(order.date)).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                        <div className={`orders-modern__status ${getStatusBadgeClass(order.status)}`}>
                                            <Icon icon={getStatusIcon(order.status)} />
                                            <span>{order.status}</span>
                                        </div>
                                    </div>

                                    <div className="orders-modern__products">
                                        {order.products.map((product) => (
                                            <div key={product.id} className="orders-modern__product-item">
                                                <div className="orders-modern__product-image">
                                                    <img src={product.image} alt={product.name} />
                                                </div>
                                                <div className="orders-modern__product-info">
                                                    <h4 className="orders-modern__product-name">{String(product.name)}</h4>
                                                    <div className="orders-modern__product-details">
                                                        <span className="orders-modern__product-variant">
                                                            <Icon icon="solar:palette-bold" />
                                                            {product.color}
                                                        </span>
                                                        <span className="orders-modern__product-variant">
                                                            <Icon icon="solar:ruler-bold" />
                                                            {product.size}
                                                        </span>
                                                        <span className="orders-modern__product-quantity">
                                                            <Icon icon="solar:cart-large-4-bold" />
                                                            SL: {product.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="orders-modern__product-price">
                                                        {formatMoney(product.price * product.quantity)}
                                                    </div>
                                                </div>
                                                {status === Order_Status.GIAO_HANG_THANH_CONG && (
                                                    <button
                                                        className="orders-modern__review-btn"
                                                        onClick={() => handleOpenModalReview(product)}
                                                    >
                                                        <Icon icon="solar:star-bold" />
                                                        Đánh giá
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="orders-modern__card-footer">
                                        <div className="orders-modern__total">
                                            <span className="orders-modern__total-label">Tổng thanh toán:</span>
                                            <span className="orders-modern__total-amount">
                                                {formatMoney(order.total)}
                                            </span>
                                        </div>
                                        <div className="orders-modern__actions">
                                            <button
                                                className="orders-modern__action-btn orders-modern__action-btn--detail"
                                                onClick={() => openModal(order)}
                                            >
                                                <Icon icon="solar:eye-bold" />
                                                Chi tiết
                                            </button>
                                            {status === Order_Status.CHO_XAC_NHAN && (
                                                <>
                                                    {order?.have_paid === false && (
                                                        <button
                                                            className="orders-modern__action-btn orders-modern__action-btn--pay"
                                                            onClick={() => handlePay(order.id, order.total)}
                                                        >
                                                            <Icon icon="solar:wallet-money-bold" />
                                                            Thanh toán
                                                        </button>
                                                    )}
                                                    {order?.have_paid === false && (
                                                        <button
                                                            className="orders-modern__action-btn orders-modern__action-btn--cancel"
                                                            onClick={() => handleCancel({id: order.id})}
                                                        >
                                                            <Icon icon="solar:close-circle-bold" />
                                                            Hủy đơn
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="orders-modern__empty">
                                <div className="orders-modern__empty-icon">
                                    <Icon icon="solar:box-minimalistic-bold-duotone" />
                                </div>
                                <h2 className="orders-modern__empty-title">Không có đơn hàng nào</h2>
                                <p className="orders-modern__empty-text">Bạn chưa có đơn hàng nào trong danh mục này</p>
                            </div>
                        )}
                    </div>

                    {orderList?.length > 0 && (
                        <div className="orders-modern__pagination">
                            <Pagination totalPages={totalPage} page={page} setPage={setPage} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div className="orders-modern__modal-overlay" onClick={closeModal}>
                    <div className="orders-modern__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="orders-modern__modal-header">
                            <h3 className="orders-modern__modal-title">
                                <Icon icon="solar:document-text-bold-duotone" />
                                Chi tiết đơn hàng
                            </h3>
                            <button className="orders-modern__modal-close" onClick={closeModal}>
                                <Icon icon="solar:close-circle-bold" />
                            </button>
                        </div>

                        <div className="orders-modern__modal-content">
                            <div className="orders-modern__modal-info">
                                <div className="orders-modern__modal-info-item">
                                    <Icon icon="solar:user-bold" />
                                    <div>
                                        <span className="orders-modern__modal-info-label">Người mua:</span>
                                        <span className="orders-modern__modal-info-value">{String(selectedOrder.user_name)}</span>
                                    </div>
                                </div>
                                <div className="orders-modern__modal-info-item">
                                    <Icon icon="solar:map-point-bold" />
                                    <div>
                                        <span className="orders-modern__modal-info-label">Địa chỉ:</span>
                                        <span className="orders-modern__modal-info-value">{selectedOrder.address_name}</span>
                                    </div>
                                </div>
                                <div className="orders-modern__modal-info-item">
                                    <Icon icon="solar:calendar-bold" />
                                    <div>
                                        <span className="orders-modern__modal-info-label">Thời gian đặt:</span>
                                        <span className="orders-modern__modal-info-value">
                                            {new Date(convertToISODate(selectedOrder.date)).toLocaleString("vi-VN")}
                                        </span>
                                    </div>
                                </div>
                                {selectedOrder.statusTime && (
                                    <div className="orders-modern__modal-info-item">
                                        <Icon icon="solar:clock-circle-bold" />
                                        <div>
                                            <span className="orders-modern__modal-info-label">Thời gian cập nhật:</span>
                                            <span className="orders-modern__modal-info-value">
                                                {new Date(convertToISODate(selectedOrder.statusTime)).toLocaleString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="orders-modern__modal-products">
                                <h4 className="orders-modern__modal-products-title">Sản phẩm trong đơn hàng</h4>
                                {selectedOrder.products.map((product) => (
                                    <div key={product.id} className="orders-modern__modal-product">
                                        <div className="orders-modern__modal-product-image">
                                            <img src={product.image} alt={product.name} />
                                        </div>
                                        <div className="orders-modern__modal-product-info">
                                            <h5 className="orders-modern__modal-product-name">{String(product.name)}</h5>
                                            <div className="orders-modern__modal-product-details">
                                                <span>Màu: {product.color}</span>
                                                <span>Size: {product.size}</span>
                                                <span>Số lượng: {product.quantity}</span>
                                            </div>
                                            <div className="orders-modern__modal-product-price">
                                                {formatMoney(product.price * product.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="orders-modern__modal-total">
                                <span className="orders-modern__modal-total-label">Tổng thanh toán:</span>
                                <span className="orders-modern__modal-total-amount">
                                    {formatMoney(selectedOrder.total)}
                                </span>
                            </div>
                        </div>

                        <div className="orders-modern__modal-footer">
                            <button className="orders-modern__modal-btn" onClick={closeModal}>
                                <Icon icon="solar:check-circle-bold" />
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                title="Đánh giá sản phẩm"
                open={isModalOpenReview}
                onCancel={handleCloseModal}
                footer={null}
            >
                {productReview &&
                    <>
                        <div style={{textAlign: 'center', marginBottom: '20px', display:"flex"}}>
                            <img
                                alt={productReview?.name || ""}
                                src={productReview.image}
                                style={{width: '150px', height: '150px', objectFit: 'cover', marginBottom: '10px'}}
                            />
                            <div className={"flex flex-col items-start"} style={{paddingLeft:"12px"}}>
                                <h3 style={{ textAlign: 'left', color: '#4e4b4b', fontSize: '16px',fontWeight: 'bold'  }}>{productReview.name}</h3>
                                <p>Giá: <span  style={{color:"red"}}>{formatMoney(productReview.price)}</span></p>
                            </div>

                        </div>
                        <div style={{display:"flex", justifyContent:"center"}}>
                            <Rate
                                allowHalf
                                value={rating}
                                onChange={setRating} // Cập nhật giá trị rating
                                style={{marginBottom: '20px',fontSize:"30px"}}
                            />
                        </div>
                        
                        <Input.TextArea
                            rows={4}
                            placeholder="Viết đánh giá của bạn..."
                            value={reviewText} // Liên kết với state reviewText
                            onChange={(e) => setReviewText(e.target.value)} // Cập nhật nội dung đánh giá
                            style={{marginBottom: '20px'}}
                        />
                        <Button
                            type="primary"
                            onClick={handleSubmit} // Gọi hàm khi nhấn nút
                            style={{width: '100%'}}
                        >
                            {hasEdit?"Cập nhật đánh giá":"Gửi đánh giá"}
                        </Button>
                    </>
                }
            </Modal>
        </div>
    );
};

export default Orders;

