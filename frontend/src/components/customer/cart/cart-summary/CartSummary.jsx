import React from 'react'
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isAuthorized = Boolean(localStorage.getItem('token'));

    const showDiscount = Boolean(discount);
    const showDelivery = selectedDeliveryType?.type === 'delivery';

    return (
        <div className="cart-summary">
            <div className="cart-summary__container">
                <h2 className="cart-summary__title">{t("cart.summary_title")}</h2>
                {(showDiscount || showDelivery) && (
                    <div className="cart-summary__rows">
                    {showDiscount &&
                        <div className="cart-summary__row">
                            <span>{t("cart.discount")}</span>
                            <span>– €{discount}</span>
                        </div>
                    }

                    {showDelivery && (
                        <div className="cart-summary__row">
                            <span>{t("cart.delivery")}</span>
                            <span>{t("common.free")}</span>
                        </div>
                    )}
                    </div>
                )}
                <div className="cart-summary__total">
                    <span className="cart-summary__total-label">
                        {t("common.total")}
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
                    {payLoading ? t("cart.processing") : t("cart.pay_total", { total: totalPrice })}
                </Button>
                {Boolean(payError) && (
                    <div className="error-state">
                        <p className="error-state__message">{payError}</p>
                    </div>
                )}

                {!isAuthorized && (
                    <div className="cart-summary__plate">
                        <Button className="cart-summary__auth-link" variant="link" onClick={() => navigate('/auth')}>{t("cart.sign_in_prompt")}</Button>
                        {' '}{t("cart.or")}{' '}
                        <Button className="cart-summary__auth-link" variant="link" onClick={() => navigate('/auth')}>{t("cart.create_account_prompt")}</Button>
                        <br></br>{' '}{t("cart.checkout_hint")}
                    </div>
                )}

                <p className="cart-summary__caption">
                    {t("cart.terms_caption")}
                </p>
            </div>
        </div>
    )
}
