import React from 'react'
import { useNavigate } from 'react-router';

import './cart-summary.css';
import '../../../shared/error-state/error-state.css';

import Button from '../../../shared/button/Button';
export default function CartSummary({
    totalPrice,
    discount,
    onPay,
    payLoading,
    payError,
    selectedDeliveryType,
    canPay,
}) {
    const navigate = useNavigate();

    const showDiscount = Boolean(discount);
    const showDelivery = selectedDeliveryType?.type === 'delivery';

    return (
        <div className="cart-summary">
            <div className="cart-summary__container">
                <h2 className="cart-summary__title">Order Summary</h2>
                {(showDiscount || showDelivery) && (
                    <div className="cart-summary__rows">
                    {showDiscount &&
                        <div className="cart-summary__row">
                            <span>Discount</span>
                            <span>– €{discount}</span>
                        </div>
                    }

                    {showDelivery && (
                        <div className="cart-summary__row">
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>
                    )}
                    </div>
                )}
                <div className="cart-summary__total">
                    <span className="cart-summary__total-label">
                        Total
                    </span>
                    <span className="cart-summary__total-value">
                        €{totalPrice}
                    </span>
                </div>
                <Button
                    className="cart-summary__button"
                    variant="dark"
                    onClick={onPay}
                    disabled={!canPay || payLoading}
                >
                    {payLoading ? 'Processing...' : `Pay €${totalPrice}`}
                </Button>
                {Boolean(payError) && (
                    <div className="error-state">
                        <p className="error-state__message">{payError}</p>
                    </div>
                )}

                <div className="cart-summary__plate">
                    <Button className="cart-summary__auth-link" variant="link" onClick={() => navigate('/login')}>Sign in</Button>
                    {' '}or{' '}
                    <Button className="cart-summary__auth-link" variant="link" onClick={() => navigate('/login')}>create an account</Button>
                    <br></br>{' '}to continue to checkout
                </div>

                <p className="cart-summary__caption">
                    By proceeding, you agree to Mursu’s terms of service and
                    privacy policy.
                </p>
            </div>
        </div>
    )
}
