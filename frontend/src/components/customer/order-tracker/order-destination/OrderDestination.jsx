import "./order-destination.css";

function formatServiceType(type) {
	if (!type) return "—";

	const map = {
		delivery: "Delivery",
		pickup: "Self Pickup",
		restaurant: "Dine-in",
	};

	return map[type] || Error("Service type not recognized");
}

export default function OrderDestination({ address, serviceType }) {
	const isDelivery = serviceType === "delivery";

	return (
		<div className="order__location">
			<div className="order__location-group">
				<p className="order__location-label">
					{isDelivery ? "Delivery Address" : "Restaurant Address"}
				</p>

				<p className="order__location-value">{address || "—"}</p>
			</div>

			<div className="order__location-group order__location-group--right">
				<p className="order__location-label">Service Type</p>

				<p className="order__location-value">
					{formatServiceType(serviceType)}
				</p>
			</div>
		</div>
	);
}
