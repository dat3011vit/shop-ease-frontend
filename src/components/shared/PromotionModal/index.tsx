import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import videoAd from '@/assets/videos/video-ad.mp4';
import './index.scss';

interface PromotionModalProps {
    visible: boolean;
    onClose: () => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ visible, onClose }) => {
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            centered
            className="promotion-modal"
            closeIcon={null}
        >
            <div className="promotion-container">
                {/* Nút X đóng */}
                <button className="promotion-close-btn" onClick={onClose}>
                    <CloseOutlined />
                </button>

                {/* Video bên trái */}
                <div className="promotion-video">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="promotion-video-player"
                    >
                        <source src={videoAd} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Nội dung ưu đãi bên phải */}
                <div className="promotion-content">
                    <div className="promotion-header">
                        <span className="promotion-badge">🎉 Ưu Đãi Đặc Biệt</span>
                        <h2 className="promotion-title">Chào Mừng Tới ORANGE!</h2>
                    </div>

                    <div className="promotion-offers">
                        <div className="offer-item">
                            <div className="offer-icon">🔥</div>
                            <div className="offer-details">
                                <h3>Giảm Ngay 20%</h3>
                                <p>Cho đơn hàng đầu tiên từ 500.000đ</p>
                            </div>
                        </div>

                        <div className="offer-item">
                            <div className="offer-icon">🎁</div>
                            <div className="offer-details">
                                <h3>Miễn Phí Vận Chuyển</h3>
                                <p>Áp dụng cho tất cả đơn hàng từ 300.000đ</p>
                            </div>
                        </div>

                        <div className="offer-item">
                            <div className="offer-icon">⚡</div>
                            <div className="offer-details">
                                <h3>Flash Sale Hôm Nay</h3>
                                <p>Giảm sốc đến 50% các sản phẩm hot</p>
                            </div>
                        </div>

                        <div className="offer-item">
                            <div className="offer-icon">💎</div>
                            <div className="offer-details">
                                <h3>Tích Điểm Thành Viên</h3>
                                <p>Đổi quà hấp dẫn cho khách hàng thân thiết</p>
                            </div>
                        </div>
                    </div>

                    <div className="promotion-cta">
                        <button className="cta-button primary" onClick={onClose}>
                            Mua Sắm Ngay
                        </button>
                        <button className="cta-button secondary" onClick={onClose}>
                            Xem Thêm Ưu Đãi
                        </button>
                    </div>

                    <div className="promotion-footer">
                        <p className="promo-code">
                            Mã: <strong>WELCOMEORANGE20</strong> - Sao chép ngay!
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PromotionModal;
