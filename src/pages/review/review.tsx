import React, { useState } from 'react';
import { Rate, Input, Button, message } from 'antd';
import {ReviewApi} from "../../service/review/review.ts";
// import 'antd/dist/antd.css';

const ProductReview = ({ userId, productId }) => {
    const [rating, setRating] = useState(0); // State cho số sao
    const [reviewText, setReviewText] = useState(""); // State cho nội dung đánh giá

    const product = {
        name: "Sản phẩm XYZ",
        price: 299.99,
        image: "https://via.placeholder.com/150",
        rating: 4,
        reviewText: "Sản phẩm rất tốt, tôi rất hài lòng!"
    };

    const handleSubmit = async() => {
        if (rating === 0 || reviewText.trim() === "") {
            message.error('Vui lòng nhập số sao và đánh giá sản phẩm.');
            return;
        }

        // Gửi đánh giá đến server
        const reviewData = {
            value:rating,
            content: reviewText, // Đổi tên thành content
            product_id:productId
        };
        try{
            const rsp = await ReviewApi.create(reviewData);
        }
        catch (e){
            console.log(e);
            message.error('Không thể gửi đánh giá: ' + error.message);
        }

        // Ví dụ về cách gửi dữ liệu (sử dụng fetch hoặc axios)
        fetch('https://your-api-endpoint.com/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
            .then(response => {
                if (response.ok) {
                    message.success('Đánh giá đã được gửi thành công!');
                    // Reset các trường input
                    setRating(0);
                    setReviewText("");
                } else {
                    throw new Error('Có lỗi xảy ra');
                }
            })
            .catch(error => {
                message.error('Không thể gửi đánh giá: ' + error.message);
            });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <img
                alt={product.name}
                src={product.image}
                style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '20px' }}
            />
            <h3>{product.name}</h3>
            <p>Giá: ${product.price.toFixed(2)}</p>
            <Rate
                allowHalf
                value={rating}
                onChange={setRating} // Cập nhật giá trị rating
            />
            <Input.TextArea
                rows={4}
                placeholder="Viết đánh giá của bạn..."
                value={reviewText} // Liên kết với state reviewText
                onChange={(e) => setReviewText(e.target.value)} // Cập nhật nội dung đánh giá
                style={{ marginTop: '20px', width: '100%' }}
            />
            <Button
                type="primary"
                style={{ marginTop: '20px', width: '100%' }}
                onClick={handleSubmit} // Gọi hàm khi nhấn nút
            >
                Gửi đánh giá
            </Button>
        </div>
    );
};

export default ProductReview;
