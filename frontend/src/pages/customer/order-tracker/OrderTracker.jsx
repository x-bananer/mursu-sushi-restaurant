import "./order-tracker.css";

export default function OrderTracker() {
  return (
    <>
      <div className="order">
      			<div className="order__hero">
      				<h1 className="order__title">Track Order</h1>
      				<div className="order__hero-right">
      					<div className="status-badge"> ⏱ Preparing Now </div>
      				</div>
      			</div>
      			<div className="order__panel">
      				<aside className="order__sidebar">
      					<details className="accordion" open>
      						<summary className="accordion__header">
      							<span className="accordion__title">Order Status</span>
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
                          <details className="accordion">
                              <summary className="accordion__header">
                                  <span className="accordion__title">Plan Journey</span>
                                  <span className="accordion__icon">
                                      <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                  </span>
                              </summary>
                              <div className="accordion__body accordion__body--journey journey">
                                  <div className="journey__modes" role="tablist">
                                      <button className="journey__mode-btn journey__mode-btn--active" type="button" aria-label="Walk">
                                          <svg className="journey__mode-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="12" cy="4.5" r="1.5" fill="currentColor"/>
                                              <path d="M9 9.5L7 17M9 9.5L12 12L15 10M9 9.5H15L14 7H10L9 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                              <path d="M12 12L11 17M15 10L16.5 13L14.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          <span className="journey__mode-label">Walk</span>
                                      </button>
      								<button
      									className="journey__mode-btn"
      									type="button"
      									aria-label="Bike"
      								>
      									<svg
      										className="journey__mode-icon"
      										viewBox="0 0 24 24"
      										fill="none"
      										xmlns="http://www.w3.org/2000/svg"
      									>
      										<circle
      											cx="6"
      											cy="15"
      											r="3"
      											stroke="currentColor"
      											strokeWidth="1.5"
      										/>
      										<circle
      											cx="18"
      											cy="15"
      											r="3"
      											stroke="currentColor"
      											strokeWidth="1.5"
      										/>
      										<path
      											d="M6 15L9 9H14L18 15"
      											stroke="currentColor"
      											strokeWidth="1.5"
      											strokeLinecap="round"
      											strokeLinejoin="round"
      										/>
      										<path
      											d="M12 9L14 15"
      											stroke="currentColor"
      											strokeWidth="1.5"
      											strokeLinecap="round"
      										/>
      										<circle
      											cx="15"
      											cy="7"
      											r="1"
      											fill="currentColor"
      										/>
      									</svg>
      									<span className="journey__mode-label"
      										>Bike</span
      									>
      								</button>
      								<button
      									className="journey__mode-btn"
      									type="button"
      									aria-label="Car"
      								>
      									<svg
      										className="journey__mode-icon"
      										viewBox="0 0 24 24"
      										fill="none"
      										xmlns="http://www.w3.org/2000/svg"
      									>
      										<path
      											d="M5 11L7 6H17L19 11"
      											stroke="currentColor"
      											strokeWidth="1.5"
      											strokeLinecap="round"
      											strokeLinejoin="round"
      										/>
      										<rect
      											x="3"
      											y="11"
      											width="18"
      											height="6"
      											rx="1"
      											stroke="currentColor"
      											strokeWidth="1.5"
      										/>
      										<circle
      											cx="7.5"
      											cy="17"
      											r="1.5"
      											stroke="currentColor"
      											strokeWidth="1.5"
      										/>
      										<circle
      											cx="16.5"
      											cy="17"
      											r="1.5"
      											stroke="currentColor"
      											strokeWidth="1.5"
      										/>
      										<path
      											d="M3 13H21"
      											stroke="currentColor"
      											strokeWidth="1"
      											strokeDasharray="2 2"
      										/>
      									</svg>
      									<span className="journey__mode-label">Car</span>
      								</button>
      								<button
      									className="journey__mode-btn"
      									type="button"
      									aria-label="Transit"
      								>
      									<svg
      										className="journey__mode-icon"
      										viewBox="0 0 24 24"
      										fill="none"
      										xmlns="http://www.w3.org/2000/svg"
      									>
      										<rect
      											x="5"
      											y="4"
      											width="14"
      											height="13"
      											rx="2"
      											stroke="currentColor"
      											strokeWidth="1.5"
      										/>
      										<path
      											d="M5 10H19"
      											stroke="currentColor"
      											strokeWidth="1.5"
      										/>
      										<circle
      											cx="8.5"
      											cy="14.5"
      											r="1"
      											fill="currentColor"
      										/>
      										<circle
      											cx="15.5"
      											cy="14.5"
      											r="1"
      											fill="currentColor"
      										/>
      										<path
      											d="M8 17L7 20M16 17L17 20"
      											stroke="currentColor"
      											strokeWidth="1.5"
      											strokeLinecap="round"
      										/>
      										<path
      											d="M9 7H15"
      											stroke="currentColor"
      											strokeWidth="1.5"
      											strokeLinecap="round"
      										/>
      									</svg>
      									<span className="journey__mode-label"
      										>Transit</span
      									>
      								</button>
      							</div>
      						</div>
      					</details>
      					<div className="order__ready">
      						<div className="order__ready-divider"></div>
      						<p className="order__ready-label">Ready at</p>
      						<p className="order__ready-time">11:20</p>
      					</div>
      				</aside>
      				<div className="order__right">
      					<div className="order__map">
      						<div className="map-placeholder">
      							<div className="map-placeholder__pin">
      								<div className="map-placeholder__diamond"></div>
      								<span className="map-placeholder__label"
      									>Address where order is now</span
      								>
      							</div>
      						</div>
      					</div>
      					<div className="order__location">
      						<div className="order__location-group">
      							<p className="order__location-label">Target Address</p>
      							<p className="order__location-value">
      								Our Address or Client's
      							</p>
      						</div>
      						<div
      							className="order__location-group order__location-group--right"
      						>
      							<p className="order__location-label">Service Type</p>
      							<p className="order__location-value">Self Pick Up</p>
      						</div>
      					</div>
      				</div>
      			</div>
      			<div className="order__bottom">
      				<div className="order-summary">
      					<p className="order-summary__label">Order</p>
      					<ul className="order-summary__items">
      						<li className="order-summary__item">
      							<span className="order-summary__name"
      								>01 Obsidian Roll</span
      							>
      							<span className="order-summary__price">$18.00</span>
      						</li>
      						<li className="order-summary__item">
      							<span className="order-summary__name"
      								>02 Bone Sashimi</span
      							>
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
      			</div></div>
    </>
  );
}
