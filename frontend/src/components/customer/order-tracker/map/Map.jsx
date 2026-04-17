import "./map.css";

export default function Map() {
    return (
        <div className="order__map">
						<div className="map-placeholder">
							<div className="map-placeholder__pin">
								<div className="map-placeholder__diamond"></div>
								<span className="map-placeholder__label">
									Address where order is now
								</span>
							</div>
						</div>
					</div>
    );
}
