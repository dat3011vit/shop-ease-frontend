import React, {useEffect, useState} from 'react';
import { Rate } from 'antd';
import { Icon } from '@iconify/react/dist/iconify.js';
import {Container} from "../../shared";
import {useLocation, useNavigate} from "react-router-dom";
import getProduct from "../../../service/product/getDetailProduct.ts";
import {IProduct} from "../../../common/models/Product.ts";
import {formatMoney} from "../../../utils";
import {Cart} from "../../../service/cart/cart.ts";
import {ReviewApi} from "@/service/review/review.ts";
import {Pagination} from "@/components/ui";
import {RootState} from "@/store";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {path} from "@/common/constants/path.ts";
import './index.scss';

const comboItems = [
    {
        image: 'combo-item1.jpg',
        title: '🎉 sparkly 🎉 Kawaii Hello Kitty Móc Khóa Hoạt Hình',
        originalPrice: '₫41,855',
        discountedPrice: '₫1,290',
    },
    {
        image: 'combo-item2.jpg',
        title: '🎉 sparkly 🎉 Bộ bốn món Dây buộc tóc dày',
        originalPrice: '₫11,593',
        discountedPrice: '₫6,840',
    },
    {
        image: 'combo-item3.jpg',
        title: '🎉 sparkly 🎉 Kẹp Tóc Mô Vịt mini Hình Cá Hoạt Hình',
        originalPrice: '₫1,669',
        discountedPrice: '₫1,000',
    },
    {
        image: 'combo-item4.jpg',
        title: '🎉 sparkly 🎉 Móc khoá kêu chip chip',
        originalPrice: '₫12,057',
        discountedPrice: '₫6,800',
    },
    {
        image: 'combo-item5.jpg',
        title: '🎉 sparkly 🎉 500 Chiếc Little Beaver Ruby Loopy',
        originalPrice: '₫2,504',
        discountedPrice: '₫2,200',
    },
    {
        image: 'combo-item6.jpg',
        title: '🎉 sparkly 🎉 Vòng tay mặt dây chuyền chuông',
        originalPrice: '₫3,802',
        discountedPrice: '₫2,990',
    },
];
const reviews = [
    {
        author: 'Nguyễn Văn A',
        avatar: 'https://example.com/avatar-1.jpg',
        content: 'Sản phẩm rất đẹp và chất lượng. Giao hàng nhanh!',
        datetime: '2 ngày trước',
    },
    {
        author: 'Trần Bảo B',
        avatar: 'https://example.com/avatar-2.jpg',
        content: 'Rất đáng tiền. Mình rất hài lòng với sản phẩm.',
        datetime: '3 ngày trước',
    },
    {
        author: 'Lê C',
        avatar: 'https://example.com/avatar-3.jpg',
        content: 'Đóng gói sản phẩm rất kỹ lưỡng. Sẽ mua lại lần sau!',
        datetime: '5 ngày trước',
    },
    {
        author: 'Hoàng D',
        avatar: 'https://example.com/avatar-4.jpg',
        content: 'Giá cả hợp lý và sản phẩm đúng mô tả.',
        datetime: '1 tuần trước',
    },
];
const ComboItem = ({ item }) => (
    <Card
        hoverable
        cover={<img alt={item.title} src={item.image} style={{ height: '150px', objectFit: 'cover' }} />}
        style={{ width: 150 }}
    >
        <Text strong>{item.title}</Text>
        <br />
        <Text delete>{item.originalPrice}</Text>
        <br />
        <Text style={{ color: 'red' }}>{item.discountedPrice}</Text>
    </Card>
);
const ProductDetail: React.FC = () => {
    const {isLoggedIn} =useSelector((state:RootState)=>state.auth)
    const location = useLocation();
    const navigate=useNavigate()
    const {id} = location?.state || {};
    const [product,setProduct]=useState<IProduct|null>(null);
    const [quantity, setQuantity] = useState(1);
    const [inputValue, setInputValue] = useState("1"); // Local state cho input
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [activeButton, setActiveButton] = useState(0);
    const [maxQuantity , setMaxQuantity] = useState(0);
    const [reviewData,setReviewData]=useState([])
    useEffect(() => {
        setMaxQuantity((prev)=> product?.csq?.[activeButton]?.quantity||0)
        const newQuantity = (() => {
            const prevQty = quantity;
            const maxQty = product?.csq?.[activeButton]?.quantity || 0;
            if (prevQty > maxQty) {
                return maxQty > 0 ? maxQty : 1;
            }
            return prevQty > 0 ? prevQty : 1;
        })();
        setQuantity(newQuantity);
        setInputValue(String(newQuantity));
    }, [product?.csq?.[activeButton]?.quantity]);
    // useEffect(() => {
    //     setScore()
    // }, [product]);
    const handleButtonClick = (index) => {
        setActiveButton(index); // Cập nhật nút được chọn
    };
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    const handleAddToCart = () => {
        // Add to cart logic
        console.log('Added to cart');
    };

    const handleBuyNow = () => {
        // Buy now logic
        console.log('Buy now');
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Calculate the reviews to display on the current page
    const paginatedReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    useEffect(() => {
        const fetchProductDetail= async(id)=>{
            try {
                const response =await getProduct({productId:id})
                if(response?.data?.data){
                    setProduct(response?.data.data);
                }
                else{
                    setProduct(null)
                }
            }
            catch (e){
                console.log(e)
                setProduct(null)
            }
        }
        fetchProductDetail(id)
    }, [id]);
    useEffect(() => {
        const fetchReviewByProductId= async(id:number,page: number)=>{
            try {
                const response =await ReviewApi.getReviewByProduct({data:id,page})
                if(response?.data?.data){
                    setReviewData(response?.data?.data?.content||[]);
                    setTotal(response?.data?.data?.totalPages||0)
                }
                else{
                    setReviewData([])
                    setTotal(0)
                }
            }
            catch (e){
                console.log(e)
                setReviewData([])
                setTotal(0)
            }
        }
        fetchReviewByProductId(id,currentPage)
    }, [id,currentPage]);
    console.log("quan",{quantity})
    const handleQuantityChange = (value) => {
        // Chỉ cập nhật nếu giá trị hợp lệ và không vượt quá max
        if (value <= maxQuantity && value >= 1) {
            setQuantity(value);
            setInputValue(String(value));
        }
    };

    const handleInputChange = (inputStr: string) => {
        // Cho phép rỗng tạm thời khi user đang xóa để nhập số mới
        if (inputStr === "") {
            setInputValue("");
            return;
        }

        const newValue = parseInt(inputStr);

        // Validate: phải là số hợp lệ
        if (isNaN(newValue)) {
            return;
        }

        // Validate: không vượt quá max
        if (newValue > maxQuantity) {
            setInputValue(String(maxQuantity));
            setQuantity(maxQuantity);
            return;
        }

        // Validate: phải >= 1
        if (newValue < 1) {
            setInputValue(inputStr); // Vẫn cho hiển thị giá trị user đang gõ
            return;
        }

        // Giá trị hợp lệ
        setInputValue(inputStr);
        setQuantity(newValue);
    };

    const handleBlur = () => {
        // Khi blur: nếu rỗng hoặc không hợp lệ → reset về 1
        if (inputValue === "" || inputValue === "0" || parseInt(inputValue) < 1 || isNaN(parseInt(inputValue))) {
            setQuantity(1);
            setInputValue("1");
        }
    };
    function jsonString(str) {
        if (typeof str !== "string") return null;
        try {
            JSON.parse(str);
            return   JSON.parse(str);
        } catch {
            return null;
        }
    }
    const addToCart=({productId,quantity,colorId,sizeId})=>{
        try{
            const res = Cart.create([{productId,quantity,colorId,sizeId}])
        }
        catch (e){
            console.log(e)
        }

    }
    const buyProduct=(item)=>{
        console.log("item",item)
        navigate("/checkout",{
            state:{
                listOrder:[{
                    id:item.productId,
                    image:item?.images?.[0]?.url,
                    title:item.title,
                    colorId:product?.csq?.[activeButton]?.color_id,
                    sizeId:product?.csq?.[activeButton]?.size_id,
                    color:product?.csq?.[activeButton]?.color,
                    size:product?.csq?.[activeButton]?.size,
                    price:item.price,
                    quantity:quantity,
                    sale:item.sale,
                    csp_id:product?.csq?.[activeButton]?.csq_id
                }]
            }
        })
    }
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('1');

    if (!product) {
        return (
            <Container>
                <div className="product-detail-modern__loading">
                    <div className="product-detail-modern__loading-spinner"></div>
                    <p>Đang tải thông tin sản phẩm...</p>
                </div>
            </Container>
        );
    }

    const currentPrice = product?.price ? product.price * (1 - (product?.sale || 0) / 100) : 0;
    const originalPrice = product?.price || 0;

    return (
        <div className="product-detail-modern">
            <Container>
                <div className="product-detail-modern__wrapper">
                    {/* Product Images Section */}
                    <div className="product-detail-modern__images">
                        <div className="product-detail-modern__main-image">
                            <div className="product-detail-modern__image-container">
                                <img
                                    src={product?.images?.[selectedImageIndex]?.url || product?.images?.[0]?.url}
                                    alt={product?.title}
                                    className="product-detail-modern__image-main"
                                />
                                {product?.sale && (
                                    <div className="product-detail-modern__sale-badge">
                                        <span className="product-detail-modern__sale-text">-{product.sale}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="product-detail-modern__thumbnail-list">
                            {product?.images?.map((image, index) => (
                                <div
                                    key={index}
                                    className={`product-detail-modern__thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <img src={image.url} alt={image.name} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="product-detail-modern__info">
                        <div className="product-detail-modern__header">
                            <h1 className="product-detail-modern__title">{product?.title}</h1>
                            <div className="product-detail-modern__rating-info">
                                <div className="product-detail-modern__rating">
                                    <Icon icon="solar:star-bold-duotone" className="product-detail-modern__star" />
                                    <span className="product-detail-modern__rating-value">
                                        {Math.round((product?.score || 0) * 10) / 10}
                                    </span>
                                </div>
                                <span className="product-detail-modern__reviews">
                                    ({product?.reviews || 0} đánh giá)
                                </span>
                            </div>
                        </div>

                        <div className="product-detail-modern__price-section">
                            <div className="product-detail-modern__price-main">
                                {formatMoney(currentPrice)}
                            </div>
                            {product?.sale && (
                                <div className="product-detail-modern__price-original">
                                    {formatMoney(originalPrice)}
                                </div>
                            )}
                        </div>

                        {/* Variants Section */}
                        <div className="product-detail-modern__variants">
                            <h3 className="product-detail-modern__section-title">Chọn biến thể</h3>
                            <div className="product-detail-modern__variant-grid">
                                {product?.csq?.map((item, index) => (
                                    <button
                                        key={`${item?.color}-${item?.size}`}
                                        className={`product-detail-modern__variant-btn ${activeButton === index ? 'active' : ''}`}
                                        onClick={() => handleButtonClick(index)}
                                    >
                                        <span className="product-detail-modern__variant-color">{item?.color}</span>
                                        <span className="product-detail-modern__variant-size">{item?.size}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Section */}
                        <div className="product-detail-modern__quantity">
                            <h3 className="product-detail-modern__section-title">Số lượng</h3>
                            <div className="product-detail-modern__quantity-controls">
                                <button
                                    className="product-detail-modern__quantity-btn"
                                    onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Icon icon="solar:minus-circle-bold" />
                                </button>
                                <input
                                    type="tel"
                                    className="product-detail-modern__quantity-input"
                                    value={inputValue}
                                    min={1}
                                    max={maxQuantity}
                                    onKeyDown={(e) => {
                                        // Chỉ cho phép số, Delete, Backspace, Arrow keys
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== "Delete" &&
                                            e.key !== "Backspace" &&
                                            e.key !== "ArrowRight" &&
                                            e.key !== "ArrowLeft"
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onBlur={handleBlur}
                                />
                                <button
                                    className="product-detail-modern__quantity-btn"
                                    onClick={() => handleQuantityChange(Math.min(maxQuantity, quantity + 1))}
                                    disabled={quantity >= maxQuantity}
                                >
                                    <Icon icon="solar:add-circle-bold" />
                                </button>
                                <span className="product-detail-modern__stock">
                                    {maxQuantity} sản phẩm có sẵn
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="product-detail-modern__actions">
                            <button
                                className="product-detail-modern__btn product-detail-modern__btn--cart"
                                onClick={() => {
                                    if (!isLoggedIn) {
                                        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
                                        navigate(path.AUTH + "/" + path.LOGIN);
                                        return;
                                    }
                                    addToCart({
                                        productId: product?.productId,
                                        quantity: quantity,
                                        colorId: product?.csq?.[activeButton]?.color_id,
                                        sizeId: product?.csq?.[activeButton]?.size_id
                                    });
                                    toast.success("Thêm sản phẩm vào giỏ hàng thành công");
                                }}
                            >
                                <Icon icon="solar:cart-large-4-bold" />
                                <span>Thêm Vào Giỏ Hàng</span>
                            </button>
                            <button
                                className="product-detail-modern__btn product-detail-modern__btn--buy"
                                onClick={() => {
                                    if (!isLoggedIn) {
                                        toast.error("Vui lòng đăng nhập để mua hàng!");
                                        navigate(path.AUTH + "/" + path.LOGIN);
                                        return;
                                    }
                                    buyProduct(product);
                                }}
                            >
                                <Icon icon="solar:bag-heart-bold" />
                                <span>Mua Ngay</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description and Reviews Tabs */}
                <div className="product-detail-modern__tabs">
                    <div className="product-detail-modern__tab-header">
                        <button
                            className={`product-detail-modern__tab-btn ${activeTab === '1' ? 'active' : ''}`}
                            onClick={() => setActiveTab('1')}
                        >
                            Mô Tả Sản Phẩm
                        </button>
                        <button
                            className={`product-detail-modern__tab-btn ${activeTab === '2' ? 'active' : ''}`}
                            onClick={() => setActiveTab('2')}
                        >
                            Đánh Giá Sản Phẩm ({reviewData?.length || 0})
                        </button>
                    </div>

                    <div className="product-detail-modern__tab-content">
                        {activeTab === '1' && (
                            <div className="product-detail-modern__description">
                                {jsonString(product?.description)?.map((item, index) => (
                                    <p key={index} className="product-detail-modern__description-item">
                                        {item}
                                    </p>
                                ))}
                            </div>
                        )}

                        {activeTab === '2' && (
                            <div className="product-detail-modern__reviews-section">
                                {reviewData?.length > 0 ? (
                                    <>
                                        <div className="product-detail-modern__reviews-list">
                                            {reviewData.map((item, index) => (
                                                <div key={index} className="product-detail-modern__review-item">
                                                    <div className="product-detail-modern__review-header">
                                                        <div className="product-detail-modern__review-avatar">
                                                            {item.user_name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div className="product-detail-modern__review-info">
                                                            <div className="product-detail-modern__review-author">
                                                                {item.user_name || 'Người dùng'}
                                                            </div>
                                                            <div className="product-detail-modern__review-rating">
                                                                <Rate
                                                                    disabled
                                                                    value={Math.min(Math.max(Math.round((item?.value || 0) * 10) / 10, 0), 5)}
                                                                />
                                                                <span className="product-detail-modern__review-date">
                                                                    {new Date(item.updated_at).toLocaleDateString('vi-VN')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="product-detail-modern__review-content">
                                                        {item.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="product-detail-modern__reviews-pagination">
                                            <Pagination
                                                totalPages={total}
                                                page={currentPage}
                                                setPage={setCurrentPage}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="product-detail-modern__no-reviews">
                                        <Icon icon="solar:chat-round-dots-bold-duotone" />
                                        <p>Chưa có đánh giá nào cho sản phẩm này</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ProductDetail;
