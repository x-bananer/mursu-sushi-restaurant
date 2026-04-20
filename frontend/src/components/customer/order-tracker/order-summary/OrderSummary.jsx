import "./order-summary.css";

export default function OrderSummary() {
	return (
		<div className="order__bottom">
				<div className="order-summary">
					<p className="order-summary__label">Order</p>
					<ul className="order-summary__items">
						<li className="order-summary__item">
							<span className="order-summary__name">
								01 Obsidian Roll
							</span>
							<span className="order-summary__price">$18.00</span>
						</li>
						<li className="order-summary__item">
							<span className="order-summary__name">
								02 Bone Sashimi
							</span>
							<span className="order-summary__price">$24.00</span>
						</li>
					</ul>
				</div>

				<div className="order-guest">
					<p className="order-guest__text">
						Ordering as guest — create a free account to save orders
						and earn badges.
					</p>
				</div>

				<div className="order-price">
					<p className="order-price__label">Total Price</p>
					<p className="order-price__value">$42.00</p>
				</div>
			</div>
	);
}
