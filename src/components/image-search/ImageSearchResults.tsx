import React from 'react';
import { Card, Rate, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { path } from '@/common/constants/path';
import './index.scss';

interface Product {
    productId: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    score?: number;  // Field từ backend (có thể là rating)
    reviewCount?: number;
    totalReviews?: number;
    images?: Array<{ url?: string; src?: string }>;
    similarity?: number;
}

interface ImageSearchResultsProps {
    products: Product[];
}

const ImageSearchResults: React.FC<ImageSearchResultsProps> = ({ products }) => {
    const navigate = useNavigate();

    const handleProductClick = (product: Product) => {
        navigate(`${path.PRODUCT_DETAIL}/${product.title}`, {
            state: { id: product.productId },
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // Lấy rating từ score hoặc rating
    const getRating = (product: Product): number => {
        return product.rating || product.score || 0;
    };

    // Lấy số lượng review
    const getReviewCount = (product: Product): number => {
        return product.reviewCount || product.totalReviews || 0;
    };

    // Lấy URL ảnh (hỗ trợ nhiều format)
    const getImageUrl = (product: Product): string => {
        if (!product.images || product.images.length === 0) {
            return '/placeholder.png';
        }
        return product.images[0]?.url || product.images[0]?.src || '/placeholder.png';
    };

    if (!products || products.length === 0) {
        return (
            <Empty
                description="Không tìm thấy sản phẩm tương tự"
                style={{ marginTop: '40px' }}
            />
        );
    }

    return (
        <div className="image-search-results">
            {products.map((product, index) => {
                const rating = getRating(product);
                const reviewCount = getReviewCount(product);

                return (
                    <Card
                        key={product.productId}
                        hoverable
                        className="product-card"
                        onClick={() => handleProductClick(product)}
                        cover={
                            <div className="product-image-container">
                                <img
                                    alt={product.title}
                                    src={getImageUrl(product)}
                                    className="product-image"
                                />
                                {product.similarity && (
                                    <div className="similarity-badge">
                                        {Math.round(product.similarity * 100)}% khớp
                                    </div>
                                )}
                            </div>
                        }
                        style={{
                            animationDelay: `${index * 0.1}s`,
                        }}
                    >
                        <div className="product-info">
                            <h4 className="product-title">{product.title}</h4>

                            <div className="product-rating">
                                <Rate
                                    disabled
                                    allowHalf
                                    value={rating}
                                    style={{ fontSize: '14px', color: '#FF6B35' }}
                                />
                                <span className="rating-value">
                                    {rating > 0 ? rating.toFixed(1) : '0.0'}
                                    {reviewCount > 0 && ` (${reviewCount} đánh giá)`}
                                </span>
                            </div>

                            <div className="product-price">
                                <span className="current-price">{formatPrice(product.price)}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                        <span className="original-price">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                        <span className="discount-badge">
                                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default ImageSearchResults;
