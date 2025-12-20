// src/NotificationPopup.js
import React, { useState, useEffect, useRef } from 'react';
import { Button, Menu, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import axios from 'axios';

const NotificationPopup = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [visible, setVisible] = useState(false);
    const currentPage = useRef(0);
    const totalRecords = useRef(0);

    const fetchNotifications = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        currentPage.current += 1;

        try {
            // Gọi API để lấy thông báo
            const response = await axios.get(`http://localhost:5000/api/notifications?page=${currentPage.current}`);
            const { total, content } = response.data;

            totalRecords.current = total; // Lưu tổng số bản ghi
            setNotifications((prev) => [...prev, ...content]);

            // Kiểm tra xem còn thông báo hay không
            if (notifications.length >= totalRecords.current) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
        if (bottom) {
            fetchNotifications();
        }
    };

    useEffect(() => {
        if (visible) {
            fetchNotifications();
        }
    }, [visible]);

    return (
        <div style={{ position: 'relative' }}>
            <Button
                icon={<BellOutlined />}
                onClick={() => setVisible(!visible)}
                style={{ position: 'relative' }}
            >
                Thông báo
            </Button>
            {visible && (
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '0',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        width: '300px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 1000,
                    }}
                    onScroll={handleScroll}
                >
                    <Menu style={{ border: 'none', margin: 0 }}>
                        {notifications.map((notification, index) => (
                            <Menu.Item key={index}>{notification}</Menu.Item>
                        ))}
                        {loading && <Spin style={{ display: 'block', margin: '10px auto' }} />}
                        {!hasMore && <div style={{ textAlign: 'center' }}>Đã hết thông báo</div>}
                    </Menu>
                </div>
            )}
        </div>
    );
};

export default NotificationPopup;