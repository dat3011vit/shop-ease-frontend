import React, { useState, useEffect, useRef } from 'react';
import {Button, Input} from 'antd';
import {ChatApi} from "../../service/chat/chat-bot.ts";
import {useNavigate} from "react-router-dom";
import {path} from "@/common/constants/path.ts";

// CSS cho typing cursor và animations
const styles = `
    .typing-cursor {
        animation: pulse 1.5s ease-in-out infinite;
        margin-left: 4px;
        font-weight: bold;
        display: inline-block;
    }
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.4;
            transform: scale(0.8);
        }
    }
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .chat-message {
        animation: slideUp 0.3s ease-out;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 6px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #ff5722 0%, #ff7733 100%);
    }

    /* Fix màu nút X trắng */
    .chat-close-btn,
    .chat-close-btn:hover,
    .chat-close-btn:focus,
    .chat-close-btn:active {
        color: #fff !important;
    }
`;

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading,setIsLoading]=useState(false)
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom khi có message mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [responses]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async() => {
        if (message.trim()) {
            const userMessage = message;
            const newResponse = {
                text: userMessage,
                isUser: true,
            };
            setResponses([...responses, newResponse]);
            setMessage('');
            setIsLoading(true);

            try{
                // Thêm một response rỗng cho bot để hiển thị streaming text
                setResponses((prev) => [...prev, {
                    text: '',
                    isUser: false,
                    isStreaming: true,
                }]);

                // Biến tạm để lưu streaming text
                let fullText = '';

                await ChatApi.queryStream(
                    userMessage,
                    // onChunk: Callback khi nhận được chunk mới
                    (chunk) => {
                        fullText += chunk;
                        // Cập nhật response realtime
                        setResponses((prev) => {
                            const newResponses = [...prev];
                            const lastResponse = newResponses[newResponses.length - 1];
                            if (lastResponse && lastResponse.isStreaming) {
                                lastResponse.text = fullText;
                            }
                            return [...newResponses]; // Return new array để trigger re-render
                        });
                    },
                    // onComplete: Callback khi streaming hoàn thành
                    () => {
                        // Đánh dấu streaming đã hoàn thành
                        setResponses((prev) => {
                            const newResponses = [...prev];
                            const lastResponse = newResponses[newResponses.length - 1];
                            if (lastResponse && lastResponse.isStreaming) {
                                lastResponse.isStreaming = false;
                            }
                            return newResponses;
                        });
                        setIsLoading(false);
                    },
                    // onError: Callback khi có lỗi
                    (error) => {
                        console.error('Streaming error:', error);
                        setResponses((prev) => {
                            const newResponses = [...prev];
                            const lastResponse = newResponses[newResponses.length - 1];
                            if (lastResponse && lastResponse.isStreaming) {
                                lastResponse.text = 'Có lỗi xảy ra, vui lòng thử lại sau!';
                                lastResponse.isStreaming = false;
                            }
                            return newResponses;
                        });
                        setIsLoading(false);
                    }
                );
            }catch(e){
                console.log(e)
                const botResponse = {
                    text: `Có lỗi xảy ra vui lòng thử lại sau!`,
                    isUser: false,
                };
                setResponses((prev) => [...prev, botResponse]);
                setIsLoading(false);
            }
        }
    };
    const handleProductClick = (title, productId) => {
        navigate(`${path.PRODUCT_DETAIL}/${title}`, {
            state: { id:productId },
        }); // Điều hướng đến trang chi tiết sản phẩm
    };

    const suggestionMessages = [
        'Tìm sản phẩm giá rẻ',
        'Tìm quần áo dự tiệc',
        'Tôi cần được hỗ trợ nhanh',
    ];

    return (
        <>
            <style>{styles}</style>
            <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
                {!isOpen && (
                <Button
                    type="primary"
                    onClick={toggleChat}
                    style={{
                        borderRadius: '50%',
                        width: 60,
                        height: 60,
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                        fontSize: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.4)';
                    }}
                >
                    💬
                </Button>
            )}

            {isOpen && (
                <div
                    style={{
                        width: 380,
                        background: '#fff',
                        border: 'none',
                        borderRadius: 20,
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflowY: 'auto',
                        maxHeight: 600,
                        minHeight: 400,
                        height:"100%"
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                            color: '#fff',
                            padding: '18px 20px',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 10px rgba(255, 107, 53, 0.2)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>💬</span>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Trợ lý ảo ORANGEBOT</div>
                                <div style={{ fontSize: '12px', opacity: 0.9 }}>Online • Sẵn sàng hỗ trợ</div>
                            </div>
                        </div>
                        <Button
                            type="text"
                            className="chat-close-btn"
                            onClick={toggleChat}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'rotate(90deg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'rotate(0deg)';
                            }}
                        >
                            <span style={{
                                color: '#fff',
                                fontSize: '20px',
                                display: 'inline-block',
                                transition: 'all 0.2s ease',
                            }}>
                                ✖
                            </span>
                        </Button>
                    </div>

                    {/* Nội dung chat */}
                    <div style={{flex:1}}>
                        <div
                            style={{
                                padding: '20px',
                                flex: 1,
                                overflowY: 'auto',
                                maxHeight: 420,
                                background: '#f8f9fa',
                            }}
                        >
                                <div
                                    style={{
                                        marginBottom: 16,
                                        padding: '12px 16px',
                                        background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
                                        borderRadius: 12,
                                        borderLeft: '4px solid #FF6B35',
                                        color: '#333',
                                        fontSize: '14px',
                                        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#FF6B35' }}>
                                        👋 Xin chào!
                                    </div>
                                    Orange Shop có thể hỗ trợ điều gì cho bạn?
                                </div>
                                {responses.map((item, index) => (
                                    <div
                                        key={index}
                                        className="chat-message"
                                        style={{
                                            textAlign: item.isUser ? 'right' : 'left',
                                            marginBottom: 12,
                                        }}
                                    >
                                        {item.isUser ? (
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '10px 16px',
                                                    borderRadius: '18px 18px 4px 18px',
                                                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                                                    color: '#fff',
                                                    maxWidth: '75%',
                                                    fontSize: '14px',
                                                    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.25)',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                        {item.text}
                                    </span>
                                        ) : (
                                            <div>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                marginBottom: 8,
                                                padding: '10px 16px',
                                                borderRadius: '18px 18px 18px 4px',
                                                background: '#fff',
                                                maxWidth: '75%',
                                                whiteSpace: 'pre-wrap',
                                                fontSize: '14px',
                                                color: '#2c3e50',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                border: '1px solid #f0f0f0',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {item.text}
                                            {item.isStreaming && <span className="typing-cursor" style={{ color: '#FF6B35' }}>●</span>}
                                        </span>
                                                {item?.data && Array.isArray(item.data)&&
                                                    item.data.map((product) => (
                                                        <div
                                                            key={product.productId}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                marginBottom: 10,
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() =>
                                                                handleProductClick(
                                                                    product.title,
                                                                    product.productId
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={product?.images?.[0]?.url}
                                                                alt={product.title}
                                                                style={{
                                                                    width: 50,
                                                                    height: 50,
                                                                    marginRight: 10,
                                                                    borderRadius: 5,
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                            <span style={{fontSize:"12px"}}>{product.title}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                        </div>
                    </div>


                    {/*/!* Nút gợi ý *!/*/}
                    {/*<div style={{ padding: '10px', borderTop: '1px solid #ddd' }}>*/}
                    {/*    {suggestionMessages.map((msg, index) => (*/}
                    {/*        <Button*/}
                    {/*            key={index}*/}
                    {/*            type="default"*/}
                    {/*            onClick={() => handleSend(msg)}*/}
                    {/*            style={{*/}
                    {/*                display: 'block',*/}
                    {/*                width: '100%',*/}
                    {/*                marginBottom: 5,*/}
                    {/*                textAlign: 'left',*/}
                    {/*                color: '#1890ff',*/}
                    {/*                borderColor: '#1890ff',*/}
                    {/*                whiteSpace: 'normal', // Thêm dòng này để văn bản tự xuống dòng*/}
                    {/*                wordBreak: 'break-word', // Đảm bảo chữ dài không bị tràn*/}
                    {/*                height: 'auto', // Đảm bảo chiều cao tự điều chỉnh*/}
                    {/*                lineHeight: 'normal', // Đặt khoảng cách dòng phù hợp*/}
                    {/*                padding: '8px 12px', // Giữ khoảng cách nội dung*/}
                    {/*        }}*/}
                    {/*        >*/}
                    {/*            {msg}*/}
                    {/*        </Button>*/}
                    {/*    ))}*/}
                    {/*</div>*/}

                    {/* Input và nút gửi */}
                    <div
                        style={{
                            display: 'flex',
                            padding: '16px 20px',
                            borderTop: '1px solid #e8e8e8',
                            background: '#fff',
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            gap: '10px',
                        }}
                    >
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            onPressEnter={handleSend}
                            style={{
                                flex: 1,
                                borderRadius: 20,
                                padding: '10px 16px',
                                border: '1px solid #e8e8e8',
                                fontSize: '14px',
                            }}
                        />
                        <Button
                            type="primary"
                            onClick={handleSend}
                            disabled={!message.trim()}
                            style={{
                                borderRadius: 20,
                                padding: '10px 24px',
                                height: 'auto',
                                background: message.trim()
                                    ? 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)'
                                    : '#d9d9d9',
                                border: 'none',
                                boxShadow: message.trim()
                                    ? '0 2px 8px rgba(255, 107, 53, 0.3)'
                                    : 'none',
                                fontWeight: '500',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                if (message.trim()) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = message.trim()
                                    ? '0 2px 8px rgba(255, 107, 53, 0.3)'
                                    : 'none';
                            }}
                        >
                            Gửi
                        </Button>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default ChatBot;
