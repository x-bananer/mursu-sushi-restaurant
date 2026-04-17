import "./order-destination.css";

export default function OrderDestination() {
    return (
        <div className="order__location">
						<div className="order__location-group">
							<p className="order__location-label">
								Target Address
							</p>
							<p className="order__location-value">
								Our Address or Client's
							</p>
						</div>
						<div className="order__location-group order__location-group--right">
							<p className="order__location-label">
								Service Type
							</p>
							<p className="order__location-value">
								Self Pick Up
							</p>
						</div>
					</div>
    );
}
