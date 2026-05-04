import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartContext } from "../../../../hooks/contextHooks/cart";
import { usePayment } from "../../../../hooks/apiHooks/cart";

import CartItem from '../cart-item/CartItem';
import CartDelivery from '../cart-delivery/CartDelivery';
import CartPayment from "../cart-payment/CartPayment";
import CartSummary from '../cart-summary/CartSummary';
import Loader from '../../../shared/loader/Loader';
import ErrorState from '../../../shared/error-state/errorState';
import EmptyState from '../../../shared/empty-state/EmptyState';

import './cart-content.css';

export default function CartContent() {
	const stripe = useStripe();
	const elements = useElements();

	const navigate = useNavigate();
	const {
		cart,
		setCart,
		loadLoading,
		loadError,
		addDishToCart,
		removeCartItem,
	} = useCartContext();

	const { createPayment, paymentLoading, paymentError } = usePayment();
	const [deliveryTypeId, setDeliveryTypeId] = useState(null);
	const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
	const [address, setAddress] = useState('');
	const [payError, setPayError] = useState(null);

	// TODO Fix after auth is done
	const isAuthorized = Boolean(localStorage.getItem('token'));
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

	const handlePay = async () => {
		setPayError(null);

		// TODO Fix after auth is done
		if (!isAuthorized) {
			navigate('/login');
			return;
		}

		const card = elements.getElement(CardElement);
		const { paymentMethod, error } = await stripe.createPaymentMethod({
			type: 'card',
			card,
		});

		if (error) {
			setPayError(error.message || 'Payment failed');
			return;
		}

		const result = await createPayment({
			deliveryTypeId,
			address: address.trim(),
			paymentMethodId: paymentMethod.id,
		});

		if (!result) {
			return;
		}

		if (result?.payment?.status === 'failed') {
			setPayError('Payment failed. Please try another card.');
			return;
		}

		if (result?.payment?.status === 'completed') {
			setCart({ items: [], total_price: 0, discount: 0 });
			navigate('/order-tracker');
		}
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
					<CartDelivery
						deliveryTypeId={deliveryTypeId}
						setDeliveryTypeId={setDeliveryTypeId}
						address={address}
						setAddress={setAddress}
						setSelectedDeliveryType={setSelectedDeliveryType}
					/>
				</section>
				<section className="cart-content__section">
					<CartPayment />
				</section>
			</div>
			<aside className="cart-content__summary">
				<CartSummary
					totalPrice={cart?.total_price}
					discount={cart?.discount}
					onPay={handlePay}
					payLoading={paymentLoading}
					payError={payError || paymentError}
					selectedDeliveryType={selectedDeliveryType}
					canPay={isAuthorized}
				/>
			</aside>
		</div>
	);
}
