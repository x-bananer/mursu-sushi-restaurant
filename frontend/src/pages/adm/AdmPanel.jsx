import "./adm-panel.css";

export default function AdmPanel() {
	return (
		<div className="admin-main">
			<section
				className="admin-page admin-page--active"
				id="page-dashboard"
			>
				<div className="admin-stats">
					<div className="stat-card">
						<p className="stat-card__label">Orders Today</p>
						<p className="stat-card__value">24</p>
					</div>
					<div className="stat-card">
						<p className="stat-card__label">Revenue Today</p>
						<p className="stat-card__value">EUR 318</p>
					</div>
					<div className="stat-card">
						<p className="stat-card__label">Pending</p>
						<p className="stat-card__value">4</p>
					</div>
					<div className="stat-card">
						<p className="stat-card__label">Ready</p>
						<p className="stat-card__value">2</p>
					</div>
				</div>

				<h2 className="admin-section-title">Live Order Board</h2>

				<div className="order-board">
					<div className="order-col">
						<div className="order-col__header">
							<span className="order-col__dot order-col__dot--pending"></span>
							<span className="order-col__label">Pending</span>
							<span className="order-col__count">2</span>
						</div>
						<div className="order-col__cards">
							<div className="order-card">
								<div className="order-card__top">
									<span className="order-card__id">
										#1042
									</span>
									<span className="order-card__time">
										12:34
									</span>
								</div>
								<p className="order-card__name">Matti K.</p>
								<ul className="order-card__items">
									<li className="order-card__item">
										<span>Sake sashimi</span>
										<span className="order-card__qty">
											x1
										</span>
									</li>
									<li className="order-card__item">
										<span>Maguro nigiri</span>
										<span className="order-card__qty">
											x2
										</span>
									</li>
								</ul>
								<div className="order-card__footer">
									<span className="order-card__total">
										EUR 27.21
									</span>
									<button
										className="btn btn--xsmall"
										type="button"
									>
										Mark Preparing
									</button>
								</div>
							</div>

							<div className="order-card">
								<div className="order-card__top">
									<span className="order-card__id">
										#1045
									</span>
									<span className="order-card__time">
										12:38
									</span>
								</div>
								<p className="order-card__name">Guest</p>
								<ul className="order-card__items">
									<li className="order-card__item">
										<span>Ebi Tempura Roll</span>
										<span className="order-card__qty">
											x1
										</span>
									</li>
								</ul>
								<div className="order-card__footer">
									<span className="order-card__total">
										EUR 14.50
									</span>
									<button
										className="btn btn--xsmall"
										type="button"
									>
										Mark Preparing
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="order-col">
						<div className="order-col__header">
							<span className="order-col__dot order-col__dot--preparing"></span>
							<span className="order-col__label">Preparing</span>
							<span className="order-col__count">1</span>
						</div>
						<div className="order-col__cards">
							<div className="order-card">
								<div className="order-card__top">
									<span className="order-card__id">
										#1040
									</span>
									<span className="order-card__time">
										12:20
									</span>
								</div>
								<p className="order-card__name">Anna S.</p>
								<ul className="order-card__items">
									<li className="order-card__item">
										<span>Unagi Kabayaki</span>
										<span className="order-card__qty">
											x1
										</span>
									</li>
									<li className="order-card__item">
										<span>Miso Soup</span>
										<span className="order-card__qty">
											x2
										</span>
									</li>
								</ul>
								<div className="order-card__footer">
									<span className="order-card__total">
										EUR 32.00
									</span>
									<button
										className="btn btn--xsmall btn--light"
										type="button"
									>
										Mark Ready
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="order-col">
						<div className="order-col__header">
							<span className="order-col__dot order-col__dot--ready"></span>
							<span className="order-col__label">Ready</span>
							<span className="order-col__count">1</span>
						</div>
						<div className="order-col__cards">
							<div className="order-card">
								<div className="order-card__top">
									<span className="order-card__id">
										#1038
									</span>
									<span className="order-card__time">
										12:15
									</span>
								</div>
								<p className="order-card__name">Guest</p>
								<ul className="order-card__items">
									<li className="order-card__item">
										<span>California Roll</span>
										<span className="order-card__qty">
											x1
										</span>
									</li>
								</ul>
								<div className="order-card__footer">
									<span className="order-card__total">
										EUR 12.80
									</span>
									<button
										className="btn btn--xsmall btn--light"
										type="button"
									>
										Complete
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
