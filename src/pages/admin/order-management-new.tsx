import React, { useState, useEffect } from "react";
import { Header } from "@/components/shared/header/index";
import {orderMenu} from "@/common/constants/menu-order.ts";

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

const OrderManagement: React.FC = () => {
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



    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const firstOrder = orders[selectedCategory]?.[0] ?? null;
        setSelectedOrder(firstOrder);
    }, [selectedCategory, orders]);

    const handleCategoryClick = (id: number) => {
        setSelectedCategory(id);
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
                case "confirm":
                    if (currentCategory === "Đơn hàng chờ xác nhận") {
                        orderToUpdate.status = "Chờ vận chuyển";
                        updatedOrders["Đơn hàng chờ vận chuyển"].push(orderToUpdate);
                    }
                    break;
                case "cancel":
                    if (currentCategory === "Đơn hàng chờ xác nhận") {
                        orderToUpdate.status = "Đã hủy";
                        updatedOrders["Đơn hàng đã hủy"].push(orderToUpdate);
                    }
                    break;
                case "ship":
                    if (currentCategory === "Đơn hàng chờ vận chuyển") {
                        orderToUpdate.status = "Đang giao";
                        updatedOrders["Đơn hàng đang giao"].push(orderToUpdate);
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
    return (
        <div>
            <Header />
            <div className="flex w-full mt-40">
                {/* Sidebar */}
                <div className="w-1/4 bg-white border-r">
                    <ul className="divide-y divide-gray-200">
                        {orderMenu.map((menu) => (
                            <li
                                key={menu.id}
                                onClick={() => handleCategoryClick(menu.id)}
                                className={`p-4 cursor-pointer ${selectedCategory === menu.id ? "bg-blue-50 font-bold" : ""}`}
                            >
                                {menu.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Hiển thị danh sách đơn hàng */}
                <div className="w-3/4 p-6">
                    <div className="space-y-4">
                        {orders[selectedCategory]?.map((order) => (
                            <div key={order.id} className="w-full bg-white p-6 shadow-lg rounded-md border-2 border-gray-300 space-y-4">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <p className="text-xl font-bold">{String(order.buyer)}</p> {/* Convert to string */}
                                    <button
                                        onClick={() => openModal(order)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>

                                {/* Danh sách sản phẩm */}
                                {order.products.map((product) => (
                                    <div key={product.id} className="flex items-center border-b pb-4">
                                        <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mr-4" />
                                        <div>
                                            <p className="font-semibold">{String(product.name)}</p> {/* Convert to string */}
                                            <p className="text-gray-600">Màu: {product.color}, Size: {product.size}</p>
                                            <p>Số lượng: {product.quantity}</p>
                                            <p>
                                                Giá: <span className="text-red-500">{(product.price * product.quantity).toLocaleString()}đ</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Tổng tiền và các hành động */}
                                <div className="pt-4 border-t">
                                    <p className="font-bold text-right">Tổng tiền: {order.total.toLocaleString()}đ</p>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        {order.status === "Chờ xác nhận" && (
                                            <>
                                                <button
                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    onClick={() => handleOrderAction(order.id, "confirm")}
                                                >
                                                    Xác nhận
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                    onClick={() => handleOrderAction(order.id, "cancel")}
                                                >
                                                    Hủy đơn
                                                </button>
                                            </>
                                        )}
                                        {order.status === "Chờ vận chuyển" && (
                                            <button
                                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                                onClick={() => handleOrderAction(order.id, "ship")}
                                            >
                                                Giao hàng
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg w-1/2">
                        <h3 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h3>

                        {/* Thông tin đơn hàng */}
                        <p><strong>Người mua:</strong> {String(selectedOrder.buyer)}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                        <p><strong>Tình trạng:</strong> {selectedOrder.status}</p>
                        <p><strong>Thời gian đặt:</strong> {new Date(convertToISODate(selectedOrder.orderTime)).toLocaleString("vi-VN")}</p>

                        {/* Thời gian trạng thái tùy thuộc vào trạng thái đơn hàng */}
                        {selectedOrder.status === "Chờ vận chuyển" && (
                            <p><strong>Thời gian xác nhận:</strong> {selectedOrder.statusTime ? new Date(convertToISODate(selectedOrder.statusTime)).toLocaleString("vi-VN") : "Chưa có"}</p>
                        )}
                        {selectedOrder.status === "Chờ hủy" && (
                            <p><strong>Thời gian yêu cầu hủy:</strong> {selectedOrder.statusTime ? new Date(convertToISODate(selectedOrder.statusTime)).toLocaleString("vi-VN") : "Chưa có"}</p>
                        )}
                        {selectedOrder.status === "Đang giao" && (
                            <p><strong>Thời gian giao cho đơn vị vận chuyển:</strong> {selectedOrder.statusTime ? new Date(convertToISODate(selectedOrder.statusTime)).toLocaleString("vi-VN") : "Chưa có"}</p>
                        )}
                        {selectedOrder.status === "Giao thành công" && (
                            <p><strong>Thời gian giao hàng thành công:</strong> {selectedOrder.statusTime ? new Date(convertToISODate(selectedOrder.statusTime)).toLocaleString("vi-VN") : "Chưa có"}</p>
                        )}
                        {selectedOrder.status === "Đã hủy" && (
                            <p><strong>Thời gian hủy:</strong> {selectedOrder.statusTime ? new Date(convertToISODate(selectedOrder.statusTime)).toLocaleString("vi-VN") : "Chưa có"}</p>
                        )}
                        {selectedOrder.status === "Đã hoàn" && (
                            <p><strong>Thời gian hoàn thành công:</strong> {selectedOrder.statusTime ? new Date(convertToISODate(selectedOrder.statusTime)).toLocaleString("vi-VN") : "Chưa có"}</p>
                        )}
                        {selectedOrder.status === "Đang hoàn" && (
                            <p><strong>Thời gian hoàn:</strong> {selectedOrder.statusTime ? new Date(convertToISODate(selectedOrder.statusTime)).toLocaleString("vi-VN") : "Chưa có"}</p>
                        )}

                        {/* Danh sách sản phẩm */}
                        <div className="space-y-4 mt-4">
                            {selectedOrder.products.map((product) => (
                                <div key={product.id} className="flex items-center border-b pb-4">
                                    <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mr-4" />
                                    <div>
                                        <p className="font-semibold">{String(product.name)}</p>
                                        <p className="text-gray-600">Màu: {product.color}, Size: {product.size}</p>
                                        <p>Số lượng: {product.quantity}</p>
                                        <p>
                                            Giá: {(product.price * product.quantity).toLocaleString()}đ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tổng tiền */}
                        <p className="font-bold text-right mt-4">Tổng tiền: {selectedOrder.total.toLocaleString()}đ</p>

                        {/* Nút đóng modal */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;

