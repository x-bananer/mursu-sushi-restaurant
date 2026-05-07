import React from "react";
import { useTranslation } from "react-i18next";

import { CardElement } from "@stripe/react-stripe-js";

import "./cart-payment.css";

export default function CartPayment() {
	const { t } = useTranslation();
	return (
		<div className="cart-payment">
			<h2 className="cart-payment__title">{t("cart.payment_title")}</h2>
			<div className="cart-payment__container">
				<CardElement options={{ disableLink: true }} />
			</div>
		</div>
	);
}
