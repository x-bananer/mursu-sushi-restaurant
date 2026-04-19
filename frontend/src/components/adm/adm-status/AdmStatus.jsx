export default function AdmStatus() {
	return (
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
	);
}
