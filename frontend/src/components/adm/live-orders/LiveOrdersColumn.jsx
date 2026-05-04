import LiveOrdersCard from "./LiveOrdersCard";

export default function LiveOrdersColumn({
	title,
	status,
	orders,
	onAction,
}) {
	return (
		<div className="order-col">
			<div className="order-col__header">
				<span className={`order-col__dot order-col__dot--${status}`}></span>
				<span className="order-col__label">{title}</span>
				<span className="order-col__count">{orders.length}</span>
			</div>

			<div className="order-col__cards">
				{orders.map((order) => (
					<LiveOrdersCard
						order={order}
						onAction={onAction}
					/>
				))}
			</div>
		</div>
	);
}
