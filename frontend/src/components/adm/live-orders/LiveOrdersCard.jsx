export default function LiveOrdersCard({ order, actionLabel, onAction }) {
	return (
		<div className="order-card">
			<div className="order-card__top">
				<span className="order-card__id">#{order.id}</span>
				<span className="order-card__time">{order.time}</span>
			</div>

			<p className="order-card__name">{order.name}</p>

			<ul className="order-card__items">
				{order.items.map((item, index) => (
					<li key={index} className="order-card__item">
						<span>{item.name}</span>
						<span className="order-card__qty">x{item.qty}</span>
					</li>
				))}
			</ul>

			<div className="order-card__footer">
				<span className="order-card__total">EUR {order.total}</span>
				<button
					className="btn btn--xsmall"
					type="button"
					onClick={() => onAction(order.id)}
				>
					{actionLabel}
				</button>
			</div>
		</div>
	);
}
