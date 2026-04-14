import "./combo-builder.css";

export default function ComboBuilder() {
	return (
		<div className="combo-page">
			<div className="combo-page__main">
				<section className="combo-page__hero">
					<h1 className="combo-page__title">Build a Set</h1>
					<p className="combo-page__subtitle">
						Select the layers for your custom oshi sushi set
					</p>
				</section>
				<section className="combo-section">
					<div className="combo-section__head">
						<h2 className="combo-section__title">Base</h2>
					</div>
					<div className="combo-section__grid combo-section__grid--three">
						<button className="combo-card" type="button">
							<span className="combo-card__title">Udon Silk</span>
							<span className="combo-card__text">
								Hand-pulled wheat
							</span>
							<span className="combo-card__price">9.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn btn--light btn--small">
									+ ADD
								</span>
							</span>
						</button>
						<button
							className="combo-card combo-card--selected"
							type="button"
						>
							<span className="combo-card__title">
								Shari Rice
							</span>
							<span className="combo-card__text">
								Vinegared koshihikari
							</span>
							<span className="combo-card__price">5.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn-counter">
									<span className="btn-counter__btn">−</span>
									<span className="btn-counter__value">
										1
									</span>
									<span className="btn-counter__btn">+</span>
								</span>
							</span>
							<span className="combo-card__badge">1</span>
						</button>
						<button className="combo-card" type="button">
							<span className="combo-card__title">
								Soba Earth
							</span>
							<span className="combo-card__text">
								Chilled buckwheat
							</span>
							<span className="combo-card__price">8.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn btn--light btn--small">
									+ ADD
								</span>
							</span>
						</button>
					</div>
				</section>
				<section className="combo-section">
					<div className="combo-section__head">
						<h2 className="combo-section__title">Fillings</h2>
					</div>
					<div className="combo-section__grid combo-section__grid--three">
						<button
							className="combo-card combo-card--selected"
							type="button"
						>
							<span className="combo-card__title">
								Seared Wagyu
							</span>
							<span className="combo-card__text">
								A5 grade strips
							</span>
							<span className="combo-card__price">34.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn-counter">
									<span className="btn-counter__btn">−</span>
									<span className="btn-counter__value">
										1
									</span>
									<span className="btn-counter__btn">+</span>
								</span>
							</span>
							<span className="combo-card__badge">1</span>
						</button>
						<button className="combo-card" type="button">
							<span className="combo-card__title">
								Bluefin Toro
							</span>
							<span className="combo-card__text">
								Fatty belly sashimi
							</span>
							<span className="combo-card__price">28.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn btn--light btn--small">
									+ ADD
								</span>
							</span>
						</button>
						<button className="combo-card" type="button">
							<span className="combo-card__title">
								Smoked Tofu
							</span>
							<span className="combo-card__text">
								Cherrywood fumed
							</span>
							<span className="combo-card__price">12.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn btn--light btn--small">
									+ ADD
								</span>
							</span>
						</button>
					</div>
				</section>
				<section className="combo-section">
					<div className="combo-section__head">
						<h2 className="combo-section__title">Toppings</h2>
					</div>
					<div className="combo-section__grid combo-section__grid--three">
						<button className="combo-card" type="button">
							<span className="combo-card__title">Nori Dust</span>
							<span className="combo-card__text">
								Toasted seaweed
							</span>
							<span className="combo-card__price">4.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn btn--light btn--small">
									+ ADD
								</span>
							</span>
						</button>
						<button
							className="combo-card combo-card--selected"
							type="button"
						>
							<span className="combo-card__title">Yuzu Zest</span>
							<span className="combo-card__text">
								Citrus essence
							</span>
							<span className="combo-card__price">6.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn-counter">
									<span className="btn-counter__btn">−</span>
									<span className="btn-counter__value">
										1
									</span>
									<span className="btn-counter__btn">+</span>
								</span>
							</span>
							<span className="combo-card__badge">3</span>
						</button>
						<button className="combo-card" type="button">
							<span className="combo-card__title">
								Daikon Lace
							</span>
							<span className="combo-card__text">
								Julienned radish
							</span>
							<span className="combo-card__price">5.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn btn--light btn--small">
									+ ADD
								</span>
							</span>
						</button>
						<button className="combo-card" type="button">
							<span className="combo-card__title">
								Shiso Leaf
							</span>
							<span className="combo-card__text">
								Wild japanese mint
							</span>
							<span className="combo-card__price">5.00</span>
							<span className="combo-card__mobile-action">
								<span className="btn btn--light btn--small">
									+ ADD
								</span>
							</span>
						</button>
					</div>
				</section>
			</div>
			<aside className="combo-summary">
				<div className="combo-summary__container">
					<h2 className="combo-summary__title">Your Set</h2>
					<div className="combo-summary__stack">
						<article className="combo-layer combo-layer--fixed">
							<div className="combo-layer__aside combo-layer__aside--left">
								<svg
									className="combo-layer__lock"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8 10V7.5C8 5.567 9.567 4 11.5 4H12.5C14.433 4 16 5.567 16 7.5V10"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
									<rect
										x="6.5"
										y={10}
										width={11}
										height={9}
										rx="1.5"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
								</svg>
							</div>
							<div className="combo-layer__main">
								<p className="combo-layer__title">Shari Rice</p>
								<p className="combo-layer__type">Top Base</p>
							</div>
							<div className="combo-layer__aside combo-layer__aside--right">
								<span className="combo-layer__price">5.00</span>
								<button
									className="btn btn--link combo-layer__btn"
									type="button"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M7 7L17 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
										<path
											d="M17 7L7 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</button>
							</div>
						</article>
						<article className="combo-layer combo-layer--draggable">
							<div className="combo-layer__aside combo-layer__aside--left">
								<span className="combo-layer__handle">⋮⋮</span>
							</div>
							<div className="combo-layer__main">
								<p className="combo-layer__title">
									Seared Wagyu
								</p>
								<p className="combo-layer__type">Filling</p>
							</div>
							<div className="combo-layer__aside combo-layer__aside--right">
								<span className="combo-layer__price">
									34.00
								</span>
								<button
									className="btn btn--link combo-layer__btn"
									type="button"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M7 7L17 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
										<path
											d="M17 7L7 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</button>
							</div>
						</article>
						<article className="combo-layer combo-layer--draggable">
							<div className="combo-layer__aside combo-layer__aside--left">
								<span className="combo-layer__handle">⋮⋮</span>
							</div>
							<div className="combo-layer__main">
								<p className="combo-layer__title">Yuzu Zest</p>
								<p className="combo-layer__type">Topping</p>
							</div>
							<div className="combo-layer__aside combo-layer__aside--right">
								<span className="combo-layer__price">6.00</span>
								<button
									className="btn btn--link combo-layer__btn"
									type="button"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M7 7L17 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
										<path
											d="M17 7L7 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</button>
							</div>
						</article>
						<article className="combo-layer combo-layer--fixed">
							<div className="combo-layer__aside combo-layer__aside--left">
								<svg
									className="combo-layer__lock"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8 10V7.5C8 5.567 9.567 4 11.5 4H12.5C14.433 4 16 5.567 16 7.5V10"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
									<rect
										x="6.5"
										y={10}
										width={11}
										height={9}
										rx="1.5"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
								</svg>
							</div>
							<div className="combo-layer__main">
								<p className="combo-layer__title">Shari Rice</p>
								<p className="combo-layer__type">Bottom Base</p>
							</div>
							<div className="combo-layer__aside combo-layer__aside--right">
								<span className="combo-layer__price">5.00</span>
								<button
									className="btn btn--link combo-layer__btn"
									type="button"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M7 7L17 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
										<path
											d="M17 7L7 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</button>
							</div>
						</article>
					</div>
					<div className="combo-summary__totals">
						<div className="combo-summary__row">
							<span className="combo-summary__label">
								Base layers
							</span>
							<span className="combo-summary__value">10.00</span>
						</div>
						<div className="combo-summary__row">
							<span className="combo-summary__label">
								Added fillings
							</span>
							<span className="combo-summary__value">34.00</span>
						</div>
						<div className="combo-summary__row">
							<span className="combo-summary__label">
								Added toppings
							</span>
							<span className="combo-summary__value">6.00</span>
						</div>
					</div>
					<div className="combo-summary__total">
						<span className="combo-summary__total-label">
							Total
						</span>
						<span className="combo-summary__total-value">
							50.00
						</span>
					</div>
					<button className="btn combo-summary__button" type="button">
						Add to cart
					</button>
				</div>
			</aside>
		</div>
	);
}
