import React, { useState } from 'react';
import {Button, Input, Spin} from 'antd';
import {ChatApi} from "../../service/chat/chat-bot.ts";
import {useNavigate} from "react-router-dom";
import {path} from "@/common/constants/path.ts";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading,setIsLoading]=useState(false)
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async() => {
        if (message.trim()) {
            const newResponse = {
                text: message,
                isUser: true,
            };
            setResponses([...responses, newResponse]);
            setMessage('');
            setIsLoading(true);
            try{
                const rsp =await ChatApi.query({question:message})
                const data =rsp?.data?.data||[]
                let text ="Dưới đây là một số gợi ý bạn có thể tham khảo qua"
                if((Array.isArray(data)&& data.length<1)|| !Array.isArray(data)){
                    text="Không tìm thấy sản phẩm phù hợp!"
                }
                const botResponse={
                    text,
                    data,
                    isUser: false,
                }
                setResponses((prev) => [...prev, botResponse]);
            }catch(e){
                console.log(e)
                const botResponse = {
                    text: `Có lỗi xa ra vui lòng thử lại sau!`,
                    isUser: false,
                    isUser: false,
                };
                setResponses((prev) => [...prev, botResponse]);
            }finally {
                setIsLoading(false); // Đặt isLoading thành false khi đã nhận được phản hồi hoặc có lỗi
            }

            // setTimeout(() => {
            //     const botResponse = {
            //         text: `Dưới đây là một số gợi ý bạn có thể tham khảo qua`,
            //         data:[
            //             {
            //
            //                 productId:1,
            //                 title:"\n" +
            //                     "Áo khoác nam nữ cao cấp trơn form rộng - Casual Oversized Jacket in Black",
            //                 img:"https://zizoou.com/cdn/shop/files/Ao-khoac-jacket-form-rong-oversize-NCC2-Black-1-1-ZiZoou-Store.jpg?v=1682699488&width=1946"
            //             },
            //             {
            //
            //                 productId:2,
            //                 title:"Áo Sơ Mi Vải Dạ | Caro",
            //                 img:"https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/470188001/item/vngoods_09_470188001_3x4.jpg?width=369"
            //             },
            //             {
            //
            //                 productId:3,
            //                 title:"Mã B209: áo khoác lông nam phong cách Hàn Quốc",
            //                 img:"https://bizweb.dktcdn.net/100/502/737/products/o1cn01qbhayr1etzj6cm6t02191623.jpg?v=1713367341023"
            //             }, {
            //
            //                 productId:4,
            //                 title:"OC078: Áo khoác vest nam cao cấp đẹp lịch lãm",
            //                 img:"https://bizweb.dktcdn.net/100/502/737/products/o1cn01arfqnz1qmhtbldzpd2962362.jpg?v=1730691850950"
            //             }
            //         ],
            //         isUser: false,
            //     };
            //     setResponses((prev) => [...prev, botResponse]);
            // }, 500);
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
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            {!isOpen && (
                <Button
                    type="primary"
                    onClick={toggleChat}
                    style={{ borderRadius: '50%', width: 50, height: 50 }}
                >
                    💬
                </Button>
            )}

            {isOpen && (
                <div
                    style={{
                        width: 300,
                        background: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflowY: 'auto',
                        maxHeight: 500,
                        minHeight: 300,
                        height:"100%"
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: '#1890ff',
                            color: '#fff',
                            padding: '10px',
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontWeight: 'bold' }}>Hỗ trợ</span>
                        <Button
                            type="text"
                            style={{ color: '#fff' }}
                            onClick={toggleChat}
                        >
                            ✖
                        </Button>
                    </div>

                    {/* Nội dung chat */}
                    <div style={{flex:1}}>
                        <Spin spinning={isLoading} tip="Đang xử lý..." size="large" style={{flex:1}}>
                            <div
                                style={{
                                    padding: '10px',
                                    flex: 1,
                                    overflowY: 'auto',
                                    maxHeight: 300,
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom: 10,
                                        color: '#555',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    Xin chào! Orange Shop có thể hỗ trợ điều gì cho bạn?
                                </div>
                                {responses.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            textAlign: item.isUser ? 'right' : 'left',
                                            marginBottom: 10,
                                        }}
                                    >
                                        {item.isUser ? (
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '8px 12px',
                                                    borderRadius: 15,
                                                    background: '#1890ff',
                                                    color: '#fff',
                                                    maxWidth: '80%',
                                                }}
                                            >
                                        {item.text}
                                    </span>
                                        ) : (
                                            <div>
                                        <span
                                            style={{
                                                display: 'block',
                                                marginBottom: 5,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {item.text}
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
                            </div>
                        </Spin>
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
                            padding: '10px',
                            borderTop: '1px solid #ddd',
                        }}
                    >
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            onPressEnter={handleSend}
                            style={{ flex: 1, marginRight: 10 }}
                        />
                        <Button
                            type="primary"
                            onClick={handleSend}
                            disabled={!message.trim() || isLoading} // Disable button nếu đang loading
                        >
                            {isLoading ? <Spin /> : 'Gửi'} {/* Hiển thị loading khi isLoading */}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
