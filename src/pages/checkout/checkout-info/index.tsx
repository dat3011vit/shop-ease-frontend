import React, { useState } from "react";
import AccordionPayment from "./accordion-payment.tsx";
// import CheckoutForm from "./CheckoutForm";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, RadioBox } from "../../../components/ui";
import "./index.scss";
import { useDispatch } from "react-redux";
// import { setPaymentMethod } from "../../../store/order-slice";
// import { PAYMENTS_METHOD } from "../../../utils/constant";
import toast from "react-hot-toast";
import {PAYMENTS_METHOD} from "../../../utils/constant.ts";
import { useTranslation } from 'react-i18next';

const CheckoutInfo = () => {
    const { t } = useTranslation('checkout');
    const [selectPaymentMethod, setSelectPaymentMethod] = useState<string>("");
    const dispatch = useDispatch();

    const handleSelectPaymentMethod = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSelectPaymentMethod(event.target.value);
    };
    const handleConfirmPaymentMethod = () => {
        if (selectPaymentMethod) {
            toast.success(t('paymentMethodSuccess'));
            // dispatch(setPaymentMethod(selectPaymentMethod));
        }
    };

    return (
        <div className="checkout-info">
            <AccordionPayment
                infoTitle="Enrico Smith+855 - 666 - 7744"
                title={t('contactInfo')}
                icon="ph:user-circle"
            >
                <span></span>
            </AccordionPayment>
            <AccordionPayment
                infoTitle="St. Paul's Road, Norris, SD 57560, Dakota, USA"
                title={t('shippingAddress')}
                icon="hugeicons:pin-location-01"
            >
                {/*<CheckoutForm />*/}
            </AccordionPayment>
            <AccordionPayment
                infoTitle="Vnpay/Cash on delivery"
                title={t('paymentMethod')}
                icon="hugeicons:credit-card-pos"
            >
                <div className="checkout-info__wrapper">
                    <div className="checkout-info__payment">
                        <RadioBox
                            name="payment"
                            value={PAYMENTS_METHOD.OFFLINE}
                            onChange={handleSelectPaymentMethod}
                        />
                        <div className="payment__icon">
                            <Icon icon="mdi:cash-on-delivery" />
                        </div>
                        <p>{t('cashOnDelivery')}</p>
                    </div>
                    <div className="checkout-info__payment">
                        <RadioBox
                            name="payment"
                            value={PAYMENTS_METHOD.ONLINE}
                            onChange={handleSelectPaymentMethod}
                        />
                        <div className="payment__icon">
                            <Icon icon="fluent:wallet-credit-card-16-regular" />
                        </div>
                        <p>{t('payWithVnpay')}</p>
                    </div>
                    <Button
                        className="checkout-info__submit"
                        type="submit"
                        variant="contain"
                        color="black"
                        onClick={handleConfirmPaymentMethod}
                    >
                        {t('confirmPaymentMethod')}
                    </Button>
                </div>
            </AccordionPayment>
        </div>
    );
};

export default CheckoutInfo;
