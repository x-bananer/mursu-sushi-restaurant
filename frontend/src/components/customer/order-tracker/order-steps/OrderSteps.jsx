import "./order-steps.css";
import { useTranslation } from "react-i18next";
import { FiChevronDown } from "react-icons/fi";

function formatTime(time) {
	if (!time) return "";

	return new Date(time).toLocaleString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function OrderSteps({ history = [], orderId, serviceType }) {
	const { t } = useTranslation();
	const STEPS = [
		{
			key: "pending",
			label: t("order_tracker.step_placed"),
			message: (formattedTime, orderId) =>
				`${formattedTime} — ${t("order_tracker.step_msg_placed", { id: orderId })}`,
		},
		{
			key: "confirmed",
			label: t("order_tracker.step_confirmed"),
			message: (formattedTime) =>
				`${formattedTime} — ${t("order_tracker.step_msg_confirmed")}`,
		},
		{
			key: "preparing",
			label: t("order_tracker.step_preparing"),
			message: (formattedTime) =>
				`${formattedTime} — ${t("order_tracker.step_msg_preparing")}`,
		},
		{
			key: "ready",
			label: t("order_tracker.step_ready"),
			message: (formattedTime, orderId, serviceType) => {
				const messages = {
					delivery: `${formattedTime} — ${t("order_tracker.step_msg_ready_delivery")}`,
					pickup: `${formattedTime} — ${t("order_tracker.step_msg_ready_pickup")}`,
					restaurant: `${formattedTime} — ${t("order_tracker.step_msg_ready_restaurant")}`,
				};

				return (
					messages[serviceType] ||
					`— ${t("order_tracker.step_msg_ready_default")}`
				);
			},
		},
	];
	console.group("ORDER STEPS DEBUG");
	console.log("history:", history);
	console.log("orderId ", orderId);
	console.log("serviceType ", serviceType);
	console.groupEnd();

	// Build index-based lookup
	const historyByIndex = {};
	history.forEach((item) => {
		const index = item.status_id - 1;

		if (index >= 0 && index < STEPS.length) {
			historyByIndex[index] = item.changed_at;
		}
	});

	// clamp current index
	const currentIndex = Math.min(
		Math.max(...history.map((item) => item.status_id - 1), 0),
		STEPS.length - 1,
	);

	const getStepState = (index) => {
		if (index < currentIndex) return "done";
		if (index === currentIndex) return "active";
		return "pending";
	};

	return (
		<details className="accordion" open>
			<summary className="accordion__header">
				<span className="accordion__title">
					{t("order_tracker.order_status")}
				</span>

				<span className="accordion__icon">
					<FiChevronDown size={14} />
				</span>
			</summary>

			<div className="accordion__body">
				<ul className="order-steps">
					{STEPS.map((step, index) => {
						const state = getStepState(index);

						const stepTime = historyByIndex[index];
						const formattedTime = formatTime(stepTime);

						let message = "";

						if (stepTime) {
							message = step.message(
								formattedTime,
								orderId,
								serviceType,
							);
						} else if (index > currentIndex) {
							message = "";
						}

						return (
							<li
								key={step.key}
								className={`order-step order-step--${state}`}
							>
								<span className="order-step__dot" />

								<div>
									<p className="order-step__label">
										{step.label}
									</p>
									<p className="order-step__meta">
										{message}
									</p>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</details>
	);
}
