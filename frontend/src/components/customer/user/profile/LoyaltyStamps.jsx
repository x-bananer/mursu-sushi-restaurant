import React from "react";

/**
 * Component to display user loyalty stamps and progress.
 */
export default function LoyaltyStamps({ stampCount, stampGoal = 5, isDiscountActive }) {
	const stampsLeft = Math.max(0, stampGoal - stampCount);
	const loyaltyHint = isDiscountActive
		? "10% discount is active for your next order"
		: `${stampsLeft} more purchase${stampsLeft === 1 ? "" : "s"} to unlock 10% on your next order`;

	return (
		<section className="profile-loyalty">
			<p className="profile-loyalty__label">Loyalty Stamps</p>
			<div className="profile-loyalty__stamps">
				{Array.from({ length: stampGoal }).map((_, index) => {
					const isActive = index < stampCount;
					return (
						<span
							key={index}
							className={`profile-loyalty__stamp${isActive ? " profile-loyalty__stamp--active" : ""}`}
						>
							{isActive ? "★" : ""}
						</span>
					);
				})}
			</div>
			<p className="profile-loyalty__hint">{loyaltyHint}</p>
		</section>
	);
}
