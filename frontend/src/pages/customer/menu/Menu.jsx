import "./menu.css";

export default function Menu() {
	return (
		<div className="menu-page">
			<section className="menu-page__hero">
				<div className="menu-page__hero-main">
					<h1 className="menu-page__title">Menu</h1>
					<p className="menu-page__subtitle">
						Browse the menu, choose your favorites, and add them to
						cart to build your order.
					</p>
				</div>
				<aside className="menu-page__hero-side">
					<div className="sticker">
						<p className="sticker__label">Today's special</p>
						<h2 className="sticker__title">Sake Sashimi</h2>
						<p className="sticker__description">
							8 slices salmon sashimi with fresh wasabi and
							pickled ginger. Served with soy sauce and a small
							seaweed salad.
						</p>
						<p className="sticker__benefit">15% off today</p>
					</div>
				</aside>
			</section>
			<section className="menu-tabs">
				<div className="menu-tabs__list">
					<button
						className="menu-tabs__button menu-tabs__button--active"
						type="button"
					>
						Sashimi
					</button>
					<button className="menu-tabs__button" type="button">
						Nigiri
					</button>
					<button className="menu-tabs__button" type="button">
						Maki
					</button>
					<button className="menu-tabs__button" type="button">
						Temaki
					</button>
					<button className="menu-tabs__button" type="button">
						Small Plates
					</button>
					<button className="menu-tabs__button" type="button">
						Sake
					</button>
				</div>
			</section>
			<section className="menu-grid">
				<article className="menu-card menu-card--light">
					<div className="menu-card__head">
						<h2 className="menu-card__title">Sake Sashimi</h2>
						<p className="menu-card__price">24.00 €</p>
					</div>
					<div className="menu-card__badges">
						<span className="menu-card__special-tag">
							Today's special
						</span>
						<span className="badge badge--dark">GF</span>
						<span className="badge badge--dark">LF</span>
					</div>
					<p className="menu-card__description">
						8 slices salmon sashimi with fresh wasabi and pickled
						ginger. Served with soy sauce and a small seaweed salad.
						A rich, buttery selection for guests who want a clean
						salmon-focused plate.
					</p>
					<div className="menu-card__footer">
						<button
							className="btn btn--small btn--accent"
							type="button"
						>
							♥
						</button>
						<div className="btn-counter btn-counter--light">
							<button className="btn-counter__btn" type="button">
								−
							</button>
							<span className="btn-counter__value">1</span>
							<button className="btn-counter__btn" type="button">
								+
							</button>
						</div>
					</div>
				</article>
				<article className="menu-card">
					<div className="menu-card__head">
						<h2 className="menu-card__title">Moguro</h2>
						<p className="menu-card__price">24.00 €</p>
					</div>
					<div className="menu-card__badges">
						<span className="badge">GF</span>
						<span className="badge">Lactose Free</span>
					</div>
					<p className="menu-card__description">
						6 slices tuna sashimi with fresh wasabi and pickled
						ginger. Served with soy sauce and marinated cucumber. A
						leaner, deeper-flavoured cut with a clean finish.
					</p>
					<div className="menu-card__footer">
						<button
							className="btn btn--small btn--accent"
							type="button"
						>
							♥
						</button>
						<div className="btn-counter">
							<button className="btn-counter__btn" type="button">
								−
							</button>
							<span className="btn-counter__value">1</span>
							<button className="btn-counter__btn" type="button">
								+
							</button>
						</div>
					</div>
				</article>
				<article className="menu-card menu-card--light">
					<div className="menu-card__head">
						<h2 className="menu-card__title">Hamachi</h2>
						<p className="menu-card__price">26.00 €</p>
					</div>
					<div className="menu-card__badges">
						<span className="badge badge--dark">GF</span>
						<span className="badge badge--dark">Dairy Free</span>
					</div>
					<p className="menu-card__description">
						8 slices hamachi sashimi with serrano and citrus oil.
						Served with ponzu, pickled daikon, and a herb salad. A
						delicate, slightly creamy plate with bright heat and
						acidity.
					</p>
					<div className="menu-card__footer">
						<button
							className="btn btn--small btn--accent"
							type="button"
						>
							♥
						</button>
						<button
							className="btn btn--small btn--dark"
							type="button"
						>
							+ Add
						</button>
					</div>
				</article>
				<article className="menu-card">
					<div className="menu-card__head">
						<h2 className="menu-card__title">Hotate</h2>
						<p className="menu-card__price">22.00 €</p>
					</div>
					<div className="menu-card__badges">
						<span className="badge">GF</span>
						<span className="badge">Lactose Free</span>
					</div>
					<p className="menu-card__description">
						6 slices Hotate scallop sashimi with yuzu salt and fresh
						wasabi. Served with ponzu and cucumber salad. A sweet,
						soft-textured option with a light citrus lift.
					</p>
					<div className="menu-card__footer">
						<button
							className="btn btn--small btn--accent"
							type="button"
						>
							♥
						</button>
						<button className="btn btn--small" type="button">
							+ Add
						</button>
					</div>
				</article>
				<article className="menu-card menu-card--light">
					<div className="menu-card__head">
						<h2 className="menu-card__title">Yasai Mori</h2>
						<p className="menu-card__price">18.00 €</p>
					</div>
					<div className="menu-card__badges">
						<span className="badge badge--dark">Vegan</span>
						<span className="badge badge--dark">Lactose Free</span>
					</div>
					<p className="menu-card__description">
						10 pieces vegetable selection with avocado, cucumber,
						daikon, seasonal pickles, and marinated tofu. Served
						with sesame dressing, steamed rice, and miso soup. A
						full vegan plate with crisp textures and balanced
						acidity.
					</p>
					<div className="menu-card__footer">
						<button
							className="btn btn--small btn--accent"
							type="button"
						>
							♥
						</button>
						<button
							className="btn btn--small btn--dark"
							type="button"
						>
							+ Add
						</button>
					</div>
				</article>
				<article className="menu-card">
					<div className="menu-card__head">
						<h2 className="menu-card__title">Tako</h2>
						<p className="menu-card__price">20.00 €</p>
					</div>
					<div className="menu-card__badges">
						<span className="badge">GF</span>
						<span className="badge">Dairy Free</span>
					</div>
					<p className="menu-card__description">
						7 slices poached octopus with pickled cucumber and house
						ponzu. Served with steamed rice and miso soup. A firmer
						bite with bright, savoury dressing and a light set
						finish.
					</p>
					<div className="menu-card__footer">
						<button
							className="btn btn--small btn--accent"
							type="button"
						>
							♥
						</button>
						<button className="btn btn--small" type="button">
							+ Add
						</button>
					</div>
				</article>
			</section>
		</div>
	);
}
