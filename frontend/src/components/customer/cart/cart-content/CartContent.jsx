import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useCartContext } from "../../../../hooks/contextHooks/cart";
import { usePayment } from "../../../../hooks/apiHooks/cart";
import { debounce } from "../../../../utils/debounce";

import CartItem from '../cart-item/CartItem';
import CartDelivery from '../cart-delivery/CartDelivery';
import CartPayment from "../cart-payment/CartPayment";
import CartSummary from '../cart-summary/CartSummary';
import Loader from '../../../shared/loader/Loader';
import ErrorState from '../../../shared/error-state/errorState';
import EmptyState from '../../../shared/empty-state/EmptyState';

import './cart-content.css';

const EMPTY_ITEMS = [];

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
	const [deliveryTypeId, setDeliveryTypeId] = useState(1);
	const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
	const [address, setAddress] = useState('');
	const [payError, setPayError] = useState(null);
	const [visibleQuantities, setVisibleQuantities] = useState({});
	const debouncedByItemRef = useRef({});
	const debouncedRemoveRef = useRef(null);

	// TODO Fix after auth is done
	const isAuthorized = Boolean(localStorage.getItem('token'));
	const items = cart?.items ?? EMPTY_ITEMS;

	useEffect(() => {
		const next = {};
		items.forEach((item) => {
			next[item.id] = item.quantity;
		});
		setVisibleQuantities(next);
	}, [items]);

	if (!debouncedRemoveRef.current) {
		debouncedRemoveRef.current = debounce((itemId) => {
			removeCartItem(itemId);
		}, 300);
	}

	const getDebouncedUpdateByItemId = (itemId) => {
		if (!debouncedByItemRef.current[itemId]) {
			debouncedByItemRef.current[itemId] = debounce((dishId, newQuantity) => {
				addDishToCart(dishId, newQuantity);
			}, 300);
		}
		return debouncedByItemRef.current[itemId];
	};

	useEffect(() => {
		return () => {
			Object.values(debouncedByItemRef.current).forEach((fn) => fn.cancel());
			if (debouncedRemoveRef.current) {
				debouncedRemoveRef.current.cancel();
			}
		};
	}, []);

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

	const handleIncrease = (item) => {
		const currentQuantity = visibleQuantities[item.id] ?? item.quantity;
		const newQuantity = currentQuantity + 1;
		setVisibleQuantities((prev) => ({ ...prev, [item.id]: newQuantity }));
		getDebouncedUpdateByItemId(item.id)(item.dish.id, newQuantity);
	};

	const handleDecrease = (item) => {
		const currentQuantity = visibleQuantities[item.id] ?? item.quantity;
		const newQuantity = currentQuantity - 1;

		if (currentQuantity <= 0) {
			return;
		}

		setVisibleQuantities((prev) => ({ ...prev, [item.id]: Math.max(0, newQuantity) }));

		if (newQuantity > 0) {
			getDebouncedUpdateByItemId(item.id)(item.dish.id, newQuantity);
		} else {
			debouncedRemoveRef.current(item.id);
		}
	};

	const handleRemove = (item) => {
		setVisibleQuantities((prev) => ({ ...prev, [item.id]: 0 }));
		debouncedRemoveRef.current(item.id);
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
										quantity={visibleQuantities[item.id] ?? item.quantity}
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
