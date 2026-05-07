import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Component to display user loyalty stamps and progress.
 */
export default function LoyaltyStamps({ stampCount, stampGoal = 5, isDiscountActive }) {
	const { t } = useTranslation();
	const stampsLeft = Math.max(0, stampGoal - stampCount);
	const loyaltyHint = isDiscountActive
		? t("profile.discount_active_hint")
		: t("profile.stamps_left_hint", { count: stampsLeft });

	return (
		<section className="profile-loyalty">
			<p className="profile-loyalty__label">{t("profile.loyalty_stamps")}</p>
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
