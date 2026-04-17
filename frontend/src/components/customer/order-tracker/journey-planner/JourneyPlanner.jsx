export default function JourneyPlanner() {
	return (
		<details className="accordion">
			<summary className="accordion__header">
							<span className="accordion__title">
								Plan Journey
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

						<div className="accordion__body accordion__body--journey journey">
							<div className="journey__modes" role="tablist">
								<button
									className="journey__mode-btn journey__mode-btn--active"
									type="button"
									aria-label="Walk"
								>
									<svg
										className="journey__mode-icon"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle
											cx="12"
											cy="4.5"
											r="1.5"
											fill="currentColor"
										/>
										<path
											d="M9 9.5L7 17M9 9.5L12 12L15 10M9 9.5H15L14 7H10L9 9.5Z"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M12 12L11 17M15 10L16.5 13L14.5 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<span className="journey__mode-label">
										Walk
									</span>
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
									<span className="journey__mode-label">
										Bike
									</span>
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
									<span className="journey__mode-label">
										Car
									</span>
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
									<span className="journey__mode-label">
										Transit
									</span>
								</button>
							</div>
						</div>

		</details>
	);
}
