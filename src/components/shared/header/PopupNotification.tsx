import React, { useState, useEffect, memo } from 'react';
import './index.scss';
import {NotiApi} from "../../../service/noti/noti.ts";
import { Client } from '@stomp/stompjs';
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import { Icon } from '@iconify/react/dist/iconify.js';
// import SockJS from 'sockjs-client';
// Định nghĩa kiểu Notification, bao gồm timestamp
interface Notification {
    id: number;
    message: string;
    timestamp: number;  // Thêm trường thời gian
}

const PopupNotification= ({setIsNoti}:{setIsNoti:React.Dispatch<boolean>}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const {user} = useSelector((state:RootState)=>state.user);
    console.log("user",{user})
    const [page,setPage]=useState(1)
    useEffect(() => {
        setIsNoti(false)
       const fetchNoti=async(page:number, limit:number)=>{
           try {
               const rsp = await NotiApi.getNoti({page, limit}, user.id)
               setNotifications(rsp?.data?.data || [])
               if(rsp?.data?.data?.length>0)setIsNoti(true)
           }catch(e){
               console.log(e)
               setNotifications( [])
           }
       }
       if(user?.id){
           fetchNoti(page,10)
       }

    }, [page,user?.id]);
    useEffect(() => {
        if(!user?.id)return ;
        // Tạo client STOMP
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8888/ws-notifications', // URL của WebSocket Backend
            reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu mất kết nối
            debug: (str) => console.log(str), // Debug thông tin kết nối

            onConnect: () => {
                // setIsConnected(true);
                console.log('WebSocket connected',user?.id);

                // Đăng ký lắng nghe thông báo từ server
                stompClient.subscribe(`/topic/notifications/${user?.id}`, (message) => {
                    setIsNoti(true)
                    const notification = JSON.parse(message.body);
                    console.log("WebSocket",notification)
                    setNotifications((prev) => [notification,...prev]);
                });
            },

            onDisconnect: () => {
                // setIsConnected(false);
                console.log('WebSocket disconnected');
            },

            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            },
        });

        // Kết nối WebSocket
        stompClient.activate();

        // Hủy kết nối khi component unmount
        return () => stompClient.deactivate();
    }, [user?.id]);

    // Hàm định dạng thời gian theo kiểu "HH:MM - DD/MM/YYYY"
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    return (
        <div className="notification-dropdown">
            <div className="notification-dropdown__header">
                <div className="notification-dropdown__header-content">
                    <div className="notification-dropdown__header-icon-wrapper">
                        <Icon icon="solar:bell-bold-duotone" className="notification-dropdown__header-icon" />
                        {notifications.length > 0 && (
                            <span className="notification-dropdown__header-badge">{notifications.length}</span>
                        )}
                    </div>
                    <div className="notification-dropdown__header-text">
                        <h3 className="notification-dropdown__title">Thông báo</h3>
                        {notifications.length > 0 && (
                            <p className="notification-dropdown__subtitle">{notifications.length} thông báo mới</p>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="notification-dropdown__content">
                {notifications.length === 0 ? (
                    <div className="notification-dropdown__empty">
                        <div className="notification-dropdown__empty-icon-wrapper">
                            <Icon icon="solar:bell-off-bold-duotone" className="notification-dropdown__empty-icon" />
                        </div>
                        <h4 className="notification-dropdown__empty-title">Không có thông báo</h4>
                        <p className="notification-dropdown__empty-text">Bạn chưa có thông báo mới nào</p>
                    </div>
                ) : (
                    <div className="notification-dropdown__list">
                        {notifications.map((notification, index) => (
                            <div key={notification.id} className={`notification-dropdown__item ${index === 0 ? 'notification-dropdown__item--new' : ''}`}>
                                <div className="notification-dropdown__item-indicator"></div>
                                <div className="notification-dropdown__item-icon">
                                    <Icon icon="solar:notification-unread-lines-bold-duotone" />
                                </div>
                                <div className="notification-dropdown__item-content">
                                    <p className="notification-dropdown__item-message">
                                        {notification.message}
                                    </p>
                                    <div className="notification-dropdown__item-footer">
                                        <Icon icon="solar:clock-circle-bold" className="notification-dropdown__time-icon" />
                                        <span className="notification-dropdown__item-time">
                                            {formatTime(typeof notification.timestamp === 'string' ? parseInt(notification.timestamp) : notification.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Export mặc định
export default memo(PopupNotification);
