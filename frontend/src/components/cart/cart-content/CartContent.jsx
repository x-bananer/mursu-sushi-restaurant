import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

import CartItem from '../cart-item/CartItem';
import CartDelivery from '../cart-delivery/CartDelivery';
import CartPayment  from "../cart-payment/CartPayment";
import CartSummary from '../cart-summary/CartSummary';

import './cart-content.css';

export default function CartContent() {
	// const stripe = useStripe();
	// const elements = useElements();

	// const sessionId = localStorage.getItem("session_id");

	// const handlePayment = async () => {
	// 	if (!stripe || !elements) return;

	// 	const card = elements.getElement(CardElement);
		
	// 	if (!card) return;

	// 	const { error, paymentMethod } = await stripe.createPaymentMethod({
	// 		type: "card",
	// 		card,
	// 	});

	// 	if (error || !paymentMethod) return;

	// 	try {
	// 		const response = await fetch(`${API_BASE_URL}/payments/stripe`, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				"x-session-id": sessionId || "",
	// 			},
	// 			body: JSON.stringify({
	// 				delivery_type_id: 3,
	// 				address,
	// 				payment_method_id: paymentMethod.id,
	// 			}),
	// 		});

	// 		const data = await response.json();
	// 		console.log(response.status, data);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	return (
		<div className="cart-content">
			<div className="cart-content__container">
				<section className="cart-content__section">
					<h1 className="cart-content__title">Cart</h1>
					<div className="cart-content__items">
						<CartItem />
                        <CartItem />
					</div>
				</section>
				<section className="cart-content__section">
                    <CartDelivery />
                </section>
				<section className="cart-content__section">
					<CartPayment />
				</section>
			</div>
            <aside className="cart-content__summary">
                <CartSummary />
            </aside>
		</div>
	);
}