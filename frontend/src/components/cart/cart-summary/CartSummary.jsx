import React from 'react'

import './cart-summary.css';

import Button from '../../shared/button/Button';

export default function CartSummary() {
    return (
        <div className="cart-summary">
            <div className="cart-summary__container">
                <h2 className="cart-summary__title">Order Summary</h2>
                <div className="cart-summary__rows">
                    <div className="cart-summary__row">
                        <span>Subtotal</span>
                        <span>€46.00</span>
                    </div>
                    <div className="cart-summary__row">
                        <span>Discount (Today’s Special)</span>
                        <span>-€4.60</span>
                    </div>
                    <div className="cart-summary__row">
                        <span>Delivery Fee</span>
                        <span>€2.50</span>
                    </div>
                </div>
                <div className="cart-summary__total">
                    <span className="cart-summary__total-label">
                        Total
                    </span>
                    <span className="cart-summary__total-value">
                        €43.90
                    </span>
                </div>
                <Button
                    className="cart-summary__button"
                    variant="dark"
                >
                    Pay €43.90
                </Button>
                <p className="cart-summary__caption">
                    By proceeding, you agree to Mursu’s terms of service and
                    privacy policy.
                </p>
            </div>
        </div>
    )
}
