import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useCartContext } from "../../../../hooks/contextHooks/cart";

import CartItem from '../cart-item/CartItem';
import CartDelivery from '../cart-delivery/CartDelivery';
import CartPayment from "../cart-payment/CartPayment";
import CartSummary from '../cart-summary/CartSummary';
import Loader from '../../../shared/loader/Loader';
import ErrorState from '../../../shared/error-state/errorState';
import EmptyState from '../../../shared/empty-state/EmptyState';

import './cart-content.css';

export default function CartContent() {
	const { cart, loadLoading, loadError, addDishToCart, removeCartItem } = useCartContext();
	const items = cart?.items || [];

	if (loadLoading) {
		return (
			<Loader isLight text="Loading cart..." />
		);
	}

	if (loadError) {
		return (
			<ErrorState isLight message={loadError} />
		);
	}

	if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
		return (
			<EmptyState
				isLight
				title="Your cart is empty"
				description="Add dishes from the menu or build a custom set."
			/>
		);
	}

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

	const handleIncrease = async (item) => {
		const newQuantity = item.quantity + 1;
		await addDishToCart(item.dish.id, newQuantity);
	};

	const handleDecrease = async (item) => {
		const newQuantity = item.quantity - 1;
		if (item.quantity > 0) {
			await addDishToCart(item.dish.id, newQuantity);
		} else {
			await removeCartItem(item.id);
		}
	};

	const handleRemove = async (item) => {
		await removeCartItem(item.id);
	};

	return (
		<div className="cart-content">
			<div className="cart-content__container">
				<section className="cart-content__section">
					<h1 className="cart-content__title">Cart</h1>
					<div className="cart-content__items">
						{
							items.map((item) => {
								return (
									<CartItem
										key={item.id}
										item={item}
										onIncrease={() => handleIncrease(item)}
										onDecrease={() => handleDecrease(item)}
										onRemove={() => handleRemove(item)}
									/>
								);
							})
						}
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
				<CartSummary
					totalPrice={cart?.total_price}
  					discount={cart?.discount}
				/>
			</aside>
		</div>
	);
}
