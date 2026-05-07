import "./order-tracker.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiClock } from "react-icons/fi";

import OrderSteps from "../../../components/customer/order-tracker/order-steps/OrderSteps";
import JourneyPlanner from "../../../components/customer/order-tracker/journey-planner/JourneyPlanner";
import OrderETA from "../../../components/customer/order-tracker/eta/OrderEta";
import Map from "../../../components/customer/order-tracker/map/Map";
import OrderDestination from "../../../components/customer/order-tracker/order-destination/OrderDestination";
import OrderSummary from "../../../components/customer/order-tracker/order-summary/OrderSummary";

import {
	useActiveOrder,
	useOrderStream,
	useOrderTracking,
	useEtaEstimation,
	useRouteByMode,
} from "../../../hooks/apiHooks/orderTracker";

import { useGeolocation } from "../../../hooks/apiHooks/geolocation";

import Loader from "../../../components/shared/loader/Loader";
import ErrorState from "../../../components/shared/error-state/ErrorState";
import EmptyState from "../../../components/shared/empty-state/EmptyState";

export default function OrderTracker() {
	const { t } = useTranslation();
	const { order, loading, error } = useActiveOrder();
	const status = useOrderStream(order?.id);
	const { history, loadTracking } = useOrderTracking(order?.id);
	const { lat, lon } = useGeolocation();
	const { etaEstimation } = useEtaEstimation(order?.id, lat, lon);
	const [selectedMode, setSelectedMode] = useState(null);
	const { route } = useRouteByMode(order?.id, lat, lon, selectedMode);

	useEffect(() => {
		if (!status?.status?.type) return;
		loadTracking();
	}, [status, loadTracking]);

	if (loading) {
		return (
			<div className="order">
				<Loader text={t("order_tracker.loading")} />
			</div>
		);
	}

	if (error) {
		return (
			<div className="order">
				<ErrorState message={error} />
			</div>
		);
	}

	if (!order) {
		return (
			<div className="order">
				<EmptyState
					title={t("order_tracker.no_active_title")}
					description={t("order_tracker.no_active_description")}
				/>
			</div>
		);
	}

	return (
		<div className="order">
			<div className="order__hero">
				<h1 className="order__title">{t("order_tracker.title")}</h1>

				<div className="order__hero-right">
					<div className="status-badge">
						<FiClock size={14} />
						{status?.status?.name ?? order?.status?.name}
					</div>
				</div>
			</div>

			<div className="order__panel">
				<aside className="order__sidebar">
					<OrderSteps
						history={history}
						orderId={order?.id}
						serviceType={order.delivery_type.type}
					/>

					<JourneyPlanner
						serviceType={order.delivery_type.type}
						recommendedMode={etaEstimation?.recommendedMode}
						selectedMode={selectedMode}
						onSelectMode={setSelectedMode}
					/>

					<OrderETA
						eta={etaEstimation}
						serviceType={order.delivery_type.type}
						durationMins={route?.durationMins}
					/>
				</aside>

				<div className="order__right">
					<Map
						mode={selectedMode}
						restaurantCoords={etaEstimation?.restaurantCoords}
						userCoords={{ lat, lon }}
						geometry={
							route?.geometry || etaEstimation?.travel?.geometry
						}
						legs={route?.legs || etaEstimation?.travel?.legs}
					/>

					<OrderDestination
						address={order.address}
						serviceType={order.delivery_type.type}
					/>
				</div>
			</div>

			<OrderSummary
				orderId={order.id}
				items={order.order_items}
				totalPrice={order.total_price}
			/>
		</div>
	);
}
