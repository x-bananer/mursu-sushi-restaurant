export default function OrderSteps() {
	return (
		<details className="accordion" open>
						<summary className="accordion__header">
							<span className="accordion__title">
								Order Status
							</span>
							<span className="accordion__icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									width="14"
									height="14"
								>
									<path
										d="M6 9L12 15L18 9"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
						</summary>

						<div className="accordion__body">
							<ul className="order-steps">
								<li className="order-step order-step--done">
									<span className="order-step__dot"></span>
									<div>
										<p className="order-step__label">
											Order Placed
										</p>
										<p className="order-step__meta">
											13:32 — Payment confirmed via
											MobilePay
										</p>
									</div>
								</li>

								<li className="order-step order-step--active">
									<span className="order-step__dot"></span>
									<div>
										<p className="order-step__label">
											Order Confirmed
										</p>
										<p className="order-step__meta">
											13:35 — Kitchen has received your
											order
										</p>
									</div>
								</li>

								<li className="order-step order-step--pending">
									<span className="order-step__dot"></span>
									<div>
										<p className="order-step__label">
											Ready for Pickup
										</p>
										<p className="order-step__meta">
											We will notify you when it's ready
										</p>
									</div>
								</li>
							</ul>
						</div>
					</details>
	);
}
