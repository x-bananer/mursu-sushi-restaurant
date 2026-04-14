import "./user-profile.css";

export default function UserProfile() {
	return (
		<div className="profile">
			<div className="profile__container">
				<section className="profile__header">
					<div className="profile__user">
						<div className="profile__avatar">
							<svg
								viewBox="0 0 48 48"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
									cx="24"
									cy="24"
									r="18"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<circle
									cx="24"
									cy="18"
									r="5"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<path
									d="M14 34C14 29 18 26 24 26C30 26 34 29 34 34"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						<div className="profile__identity">
							<h1 className="profile__name">Matti Korhonen</h1>
							<p className="profile__meta">
								Member since Jan 2025
							</p>
						</div>
					</div>
					<div className="profile__actions">
						<button className="btn btn--light" type="button">
							Edit Profile
						</button>
					</div>
				</section>
				<section className="profile__stats">
					<section className="profile-loyalty">
						<p className="profile-loyalty__label">Loyalty Stamps</p>
						<div className="profile-loyalty__stamps">
							<span className="profile-loyalty__stamp profile-loyalty__stamp--active">
								★
							</span>
							<span className="profile-loyalty__stamp"></span>
							<span className="profile-loyalty__stamp"></span>
							<span className="profile-loyalty__stamp"></span>
							<span className="profile-loyalty__stamp"></span>
						</div>
						<p className="profile-loyalty__hint">
							4 more purchases until 10% discount
						</p>
					</section>
					<div className="profile__stats-side">
						<section className="profile-stat-card">
							<p className="profile-stat-card__label">
								Next Milestone
							</p>
							<p className="profile-stat-card__value">10% off</p>
						</section>
						<section className="profile-stat-card profile-stat-card--light">
							<p className="profile-stat-card__label">
								Rewards Earned
							</p>
							<p className="profile-stat-card__value">12</p>
						</section>
					</div>
				</section>
			</div>
		</div>
	);
}
