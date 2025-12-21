import React, {useEffect, useState} from 'react';
import { Checkbox } from 'antd';
import { Icon } from '@iconify/react/dist/iconify.js';
import {Container} from "../../components/shared";
import {Pagination} from "../../components/ui";
import {Cart, ICartItem} from "../../service/cart/cart.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {formatMoney} from "../../utils";
import { useTranslation } from 'react-i18next';
import './cart.scss';

const AdvancedCartPage = () => {
    const { t } = useTranslation('cart');
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [cartItems, setCartItems] = useState<(ICartItem & { selected: boolean })[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetch=async()=>{
            try{
                const response = await Cart.getLimit({page,size:10});
                if(response?.data?.isSuccess){
                    setCartItems(response?.data?.data?.content||[])
                    setTotalPage(response?.data?.data?.totalPages)
                }
                else{
                    setCartItems([])
                }
            }
            catch(e){
                console.log(e)
                setCartItems([])
            }
        }
        fetch()
        setSelectAll(false); // Reset select all on page change
    }, [page]);
    const updateQuantity = (key, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.cart_product_id === key ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (key) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.cart_product_id !== key));
    };

    const handleSelectAllChange = (checked) => {
        setSelectAll(checked);
        setCartItems((prevItems) =>
            prevItems.map((item) => ({ ...item, selected: checked }))
        );
    };

    const handleItemSelectChange = (key, checked) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) =>
                item.cart_product_id === key ? { ...item, selected: checked } : item
            );
            const allSelected = updatedItems.every((item) => item.selected);
            setSelectAll(allSelected);
            return updatedItems;
        });
    };


    const total = cartItems.reduce((sum, item) => (item.selected ? sum + item.price * item.quantity : sum), 0);
    const handlePurchase=()=>{
        const selectedItems = cartItems.filter((item) => item.selected);
        if (selectedItems.length === 0) {
            toast.warning(t('selectAtLeastOne'));
            return;
        }
        navigate("/checkout",{
            state:{
                listOrder:selectedItems?.map(item=>({
                    id:item.productId,
                    image:item.imageSrc,
                    title:item.product,
                    colorId:item.colorId,
                    sizeId:item.sizeId,
                    color:item.colors,
                    size:item.size,
                    price:item.price,
                    quantity:item.quantity,
                    sale:item.sale,
                    csp_id:item.cspId
                }))
            }
        })
        // Simulate a purchase process (replace this with your API call or business logic)
        // toast.success(`Đã đặt mua ${selectedItems.length} sản phẩm thành công!`);
        console.log('Purchasing items:', selectedItems);
    }
    const columns = [
        {
            title: (
                <Checkbox
                    checked={selectAll}
                    onChange={(e) => handleSelectAllChange(e.target.checked)}
                />
            ),
            key: 'checkbox',
            render: (_, record) => (
                <Checkbox
                    checked={record.selected || false}
                    onChange={(e) => handleItemSelectChange(record.cart_product_id, e.target.checked)}
                />
            ),
        },
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => (
                <Row gutter={16}>
                    <Col>
                        <Image width={80} height={80} src={record?.imageSrc} />
                    </Col>
                    <Col  style={{ flex: 1, overflow: 'hidden' }}>
                        <Paragraph strong title={record.product}
                              ellipsis={{
                                  rows:2,
                                  // expandable: true
                              }}
                              // style={{
                              //   overflow: 'hidden',
                              //   textOverflow:'ellipsis',
                              //   display: '-webkit-box',
                              //   WebkitBoxOrient: 'vertical',
                              //   WebkitLineClamp: 2, // Giới hạn 2 dòng
                              //   // whiteSpace: 'normal',
                              //
                              //   }}
                        >{record.product}</Paragraph>
                        <Text type="secondary">{`Phân loại: ${record?.size}-${record?.colors}`}</Text>
                    </Col>
                </Row>
            ),
        },
        {
            title: 'Đơn giá',
            key: 'price',
            render: (_, record) => (
                <div>
                    <Text type="danger" style={{
                        whiteSpace:'nowrap'
                    }}>{`${record.price.toLocaleString()}₫`}</Text>
                    <br />
                    {record.originalPrice && (
                        <Text delete type="secondary">
                            {`${record.originalPrice.toLocaleString()}₫`}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => updateQuantity(record.cart_product_id, value)}
                />
            ),
        },
        {
            title: 'Số tiền',
            key: 'total',
            render: (_, record) =>
                `${(record.price * record.quantity).toLocaleString()}₫`,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button danger onClick={() => removeItem(record.cart_product_id)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <div className="cart-page-modern">
            <Container>
                <div className="cart-page-modern__wrapper">
                    <div className="cart-page-modern__header">
                        <h1 className="cart-page-modern__title">
                            <Icon icon="solar:cart-large-4-bold-duotone" />
                            {t('title')}
                        </h1>
                        <p className="cart-page-modern__subtitle">
                            {t('itemsCount', { count: cartItems.length })}
                        </p>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="cart-page-modern__main">
                            <div className="cart-page-modern__list">
                                <div className="cart-page-modern__list-header">
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={(e) => handleSelectAllChange(e.target.checked)}
                                        className="cart-page-modern__select-all"
                                    >
                                        <span className="cart-page-modern__select-all-text">{t('selectAll')}</span>
                                    </Checkbox>
                                </div>

                                <div className="cart-page-modern__items">
                                    {cartItems.map((item) => (
                                        <div key={item.cart_product_id} className="cart-page-modern__item">
                                            <Checkbox
                                                checked={item.selected || false}
                                                onChange={(e) => handleItemSelectChange(item.cart_product_id, e.target.checked)}
                                                className="cart-page-modern__item-checkbox"
                                            />
                                            
                                            <div className="cart-page-modern__item-image">
                                                <img src={item.imageSrc} alt={item.product} />
                                            </div>

                                            <div className="cart-page-modern__item-info">
                                                <h3 className="cart-page-modern__item-name">{item.product}</h3>
                                                <div className="cart-page-modern__item-variant">
                                                    <span>
                                                        <Icon icon="solar:palette-bold" width={16} height={16} style={{ display: 'inline-block', visibility: 'visible' }} />
                                                        {item.colors}
                                                    </span>
                                                    <span>
                                                        <Icon icon="solar:ruler-bold" width={16} height={16} style={{ display: 'inline-block', visibility: 'visible' }} />
                                                        {item.size}
                                                    </span>
                                                </div>
                                                <div className="cart-page-modern__item-price">
                                                    <span className="cart-page-modern__item-price-current">
                                                        {formatMoney(item.price)}
                                                    </span>
                                                    {item.originalPrice && item.originalPrice > item.price && (
                                                        <span className="cart-page-modern__item-price-original">
                                                            {formatMoney(item.originalPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="cart-page-modern__item-quantity">
                                                <button
                                                    className="cart-page-modern__quantity-btn"
                                                    onClick={() => updateQuantity(item.cart_product_id, Math.max(1, item.quantity - 1))}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Icon icon="solar:minus-circle-bold" width={20} height={20} style={{ display: 'inline-block', visibility: 'visible' }} />
                                                </button>
                                                <input
                                                    type="number"
                                                    className="cart-page-modern__quantity-input"
                                                    value={item.quantity}
                                                    min={1}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 1;
                                                        updateQuantity(item.cart_product_id, val);
                                                    }}
                                                />
                                                <button
                                                    className="cart-page-modern__quantity-btn"
                                                    onClick={() => updateQuantity(item.cart_product_id, item.quantity + 1)}
                                                >
                                                    <Icon icon="solar:add-circle-bold" width={20} height={20} style={{ display: 'inline-block', visibility: 'visible' }} />
                                                </button>
                                            </div>

                                            <div className="cart-page-modern__item-total">
                                                {formatMoney(item.price * item.quantity)}
                                            </div>

                                            <button
                                                className="cart-page-modern__item-remove"
                                                onClick={() => removeItem(item.cart_product_id)}
                                            >
                                                <Icon icon="solar:trash-bin-minimalistic-bold" width={22} height={22} style={{ display: 'inline-block', visibility: 'visible' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-page-modern__pagination">
                                    <Pagination totalPages={totalPage} page={page} setPage={setPage} />
                                </div>
                            </div>

                            <div className="cart-page-modern__summary">
                                <div className="cart-page-modern__summary-header">
                                    <h3 className="cart-page-modern__summary-title">
                                        <Icon icon="solar:receipt-bold-duotone" />
                                        {t('orderSummary')}
                                    </h3>
                                </div>

                                <div className="cart-page-modern__summary-content">
                                    <div className="cart-page-modern__summary-row">
                                        <span>{t('subtotal')}:</span>
                                        <span>{formatMoney(total)}</span>
                                    </div>
                                    <div className="cart-page-modern__summary-row">
                                        <span>{t('shippingFee')}:</span>
                                        <span className="cart-page-modern__shipping-free">{t('free')}</span>
                                    </div>
                                    <div className="cart-page-modern__summary-divider"></div>
                                    <div className="cart-page-modern__summary-total">
                                        <span>{t('totalPayment')}:</span>
                                        <span className="cart-page-modern__summary-total-amount">
                                            {formatMoney(total)}
                                        </span>
                                    </div>
                                </div>

                                <div className="cart-page-modern__summary-actions">
                                    <button
                                        className="cart-page-modern__checkout-btn"
                                        disabled={total === 0}
                                        onClick={handlePurchase}
                                    >
                                        <Icon icon="solar:wallet-money-bold" />
                                        {t('checkout')}
                                    </button>
                                </div>

                                <div className="cart-page-modern__voucher">
                                    <Icon icon="solar:ticket-bold-duotone" />
                                    <span>{t('voucherMessage')}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="cart-page-modern__empty">
                            <div className="cart-page-modern__empty-icon">
                                <Icon icon="solar:cart-large-4-bold-duotone" />
                            </div>
                            <h2 className="cart-page-modern__empty-title">{t('emptyCart')}</h2>
                            <p className="cart-page-modern__empty-text">
                                {t('emptyMessage')}
                            </p>
                            <button
                                className="cart-page-modern__empty-btn"
                                onClick={() => navigate('/')}
                            >
                                <Icon icon="solar:shop-bold" />
                                {t('continueShopping')}
                            </button>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default AdvancedCartPage;
