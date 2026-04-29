import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

import "./cart.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CartContent() {
	const stripe = useStripe();
	const elements = useElements();
	const [address, setAddress] = useState("Testikatu 12 A 4, Helsinki");
	const sessionId = localStorage.getItem("session_id");

	const handlePayment = async () => {
		if (!stripe || !elements) return;

		const card = elements.getElement(CardElement);
		
		if (!card) return;

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card,
		});

		if (error || !paymentMethod) return;

		try {
			const response = await fetch(`${API_BASE_URL}/payments/stripe`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-session-id": sessionId || "",
				},
				body: JSON.stringify({
					delivery_type_id: 3,
					address,
					payment_method_id: paymentMethod.id,
				}),
			});

			const data = await response.json();
			console.log(response.status, data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="cart-page">
			<div className="cart-page__container">
				<section className="cart-page__section">
					<h1 className="cart-page__title">Cart</h1>
					<div className="cart-page__items">
						<article className="cart-item">
							<div className="cart-item__content">
								<div className="cart-item__main">
									<h2 className="cart-item__title">
										Sake Sashimi
									</h2>
									<p className="cart-item__description">
										Premium Atlantic salmon, hand-sliced,
										served with fresh wasabi and aged soy.
									</p>
									<button
										className="btn btn--link cart-item__btn"
										type="button"
									>
										Remove
									</button>
								</div>
								<div className="cart-item__aside">
									<p className="cart-item__price">€24.00</p>
									<div className="btn-counter">
										<button
											className="btn-counter__btn"
											type="button"
										>
											−
										</button>
										<span className="btn-counter__value">
											1
										</span>
										<button
											className="btn-counter__btn"
											type="button"
										>
											+
										</button>
									</div>
								</div>
							</div>
						</article>
						<article className="cart-item">
							<div className="cart-item__content">
								<div className="cart-item__main">
									<h2 className="cart-item__title">Hotate</h2>
									<p className="cart-item__description">
										Hokkaido scallops, sweet and firm. Two
										pieces per serving.
									</p>
									<button
										className="btn btn--link cart-item__btn"
										type="button"
									>
										Remove
									</button>
								</div>
								<div className="cart-item__aside">
									<p className="cart-item__price">€22.00</p>
									<div className="btn-counter">
										<button
											className="btn-counter__btn"
											type="button"
										>
											−
										</button>
										<span className="btn-counter__value">
											1
										</span>
										<button
											className="btn-counter__btn"
											type="button"
										>
											+
										</button>
									</div>
								</div>
							</div>
						</article>
					</div>
				</section>
				<section className="cart-page__section delivery">
					<h2 className="delivery__title">Delivery</h2>
					<div className="delivery__options">
						<button
							className="delivery__option delivery__option--active"
							type="button"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={1}
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx={6} cy={17} r={2} />
								<circle cx={18} cy={17} r={2} />
								<path d="M6 17h8l2-5h3" />
								<path d="M10 12h5" />
								<path d="M6 17l3-7h5" />
							</svg>
							<span className="delivery__label">Delivery</span>
						</button>
						<button className="delivery__option" type="button">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M6 3v7"
									stroke="currentColor"
									strokeWidth={1}
									strokeLinecap="round"
								/>
								<path
									d="M8 3v7"
									stroke="currentColor"
									strokeWidth={1}
									strokeLinecap="round"
								/>
								<path
									d="M10 3v7"
									stroke="currentColor"
									strokeWidth={1}
									strokeLinecap="round"
								/>
								<path
									d="M8 10v11"
									stroke="currentColor"
									strokeWidth={1}
									strokeLinecap="round"
								/>
								<path
									d="M16 3v18"
									stroke="currentColor"
									strokeWidth={1}
									strokeLinecap="round"
								/>
								<path
									d="M16 3c-2 2-2 6 0 8"
									stroke="currentColor"
									strokeWidth={1}
									strokeLinecap="round"
								/>
							</svg>
							<span className="delivery__label">Dine-in</span>
						</button>
						<button className="delivery__option" type="button">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M6 8h12l-1 12H7L6 8z"
									stroke="currentColor"
									strokeWidth={1}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M9 8V6a3 3 0 0 1 6 0v2"
									stroke="currentColor"
									strokeWidth={1}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="delivery__label">Pickup</span>
						</button>
					</div>
					<label className="input-field">
						<input
							className="input-field__input"
							type="text"
							placeholder="Enter the delivery address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</label>
				</section>
				<section className="cart-page__section payment">
					<h2 className="payment__title">Payment</h2>
					<div
						style={{
							padding: "24px",
							border: "1px solid var(--color-dark-gray)",
							background: "#fff",
							color: "#000",
						}}
					>
						<CardElement options={{ disableLink: true }} />
					</div>
				</section>
			</div>
			<aside className="cart-page__summary order-summary">
				<div className="order-summary__container">
					<h2 className="order-summary__title">Order Summary</h2>
					<div className="order-summary__rows">
						<div className="order-summary__row">
							<span>Subtotal</span>
							<span>€46.00</span>
						</div>
						<div className="order-summary__row">
							<span>Discount (Today’s Special)</span>
							<span>-€4.60</span>
						</div>
						<div className="order-summary__row">
							<span>Delivery Fee</span>
							<span>€2.50</span>
						</div>
					</div>
					<div className="order-summary__total">
						<span className="order-summary__total-label">
							Total
						</span>
						<span className="order-summary__total-value">
							€43.90
						</span>
					</div>
					<button
						className="btn btn--dark order-summary__button"
						type="button"
						onClick={handlePayment}
					>
						Pay €43.90
					</button>
					<p className="order-summary__caption">
						By proceeding, you agree to Mursu’s terms of service and
						privacy policy.
					</p>
				</div>
			</aside>
		</div>
	);
}

export default function Cart() {
	return (
		<Elements stripe={stripePromise}>
			<CartContent />
		</Elements>
	);
}
