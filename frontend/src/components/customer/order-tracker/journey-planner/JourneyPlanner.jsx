import "./journey-planner.css";
import { useTranslation } from "react-i18next";

import { FiChevronDown } from "react-icons/fi";
import { FaWalking, FaBicycle, FaCar, FaBus } from "react-icons/fa";
import { Icon } from "leaflet";

const MODES = [
	{ key: "walk", label: "mode_walk", icon: FaWalking },
	{ key: "bike", label: "mode_bike", icon: FaBicycle },
	{ key: "car", label: "mode_car", icon: FaCar },
	{ key: "transit", label: "mode_transit", icon: FaBus },
];

export default function JourneyPlanner({
	serviceType,
	recommendedMode,
	selectedMode,
	onSelectMode,
}) {
	const { t } = useTranslation();
	if (serviceType === "delivery") return null;
	const activeMode = selectedMode ?? recommendedMode;

	return (
		<details className="accordion" open>
			<summary className="accordion__header">
				<span className="accordion__title">
					{t("order_tracker.plan_journey")}
				</span>

				<span className="accordion__icon">
					<FiChevronDown size={14} />
				</span>
			</summary>

			<div className="accordion__body accordion__body--journey journey">
				<div className="journey__modes" role="tablist">
					{MODES.map(({ key, label, icon: Icon }) => {
						const isActive = activeMode === key;

						return (
							<button
								key={key}
								className={`journey__mode-btn ${
									isActive ? "journey__mode-btn--active" : ""
								}`}
								type="button"
								onClick={() => onSelectMode?.(key)}
								aria-pressed={isActive}
								aria-label={t(`order_tracker.${label}`)}
							>
								<Icon className="journey__mode-icon" />
								<span className="journey__mode-label">
									{t(`order_tracker.${label}`)}
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</details>
	);
}
