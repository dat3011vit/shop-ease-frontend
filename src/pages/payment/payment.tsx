import { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const PaymentForm = () => {
    const [amount, setAmount] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/vnpay/createPayment', { amount });
            setPaymentUrl(response.data); // Lưu URL của thanh toán
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Amount:</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <button type="submit">Pay with VNPay</button>
            </form>

            {paymentUrl && (
                <div>
                    <h3>Scan QR Code to Pay:</h3>
                    <QRCodeSVG value={paymentUrl} />
                </div>
            )}
        </div>
    );
};

export default PaymentForm;