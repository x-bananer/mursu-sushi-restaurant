import React from 'react'

import { CardElement } from "@stripe/react-stripe-js";

import './cart-payment.css';

export default function CartPayment() {
    return (
        <div className="cart-payment">
            <h2 className="cart-payment__title">Payment</h2>
            <div className="cart-payment__container">
                <CardElement options={{ disableLink: true }} />
            </div>
        </div>
    )
}
