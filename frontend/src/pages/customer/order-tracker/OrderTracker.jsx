import "./order-tracker.css";
import OrderSteps from "../../../components/customer/order-tracker/order-steps/OrderSteps";
import JourneyPlanner from "../../../components/customer/order-tracker/journey-planner/JourneyPlanner";
import Map from "../../../components/customer/order-tracker/map/Map";
import OrderDestination from "../../../components/customer/order-tracker/order-destination/OrderDestination";
import OrderSummary from "../../../components/customer/order-tracker/order-summary/OrderSummary";

export default function OrderTracker() {
	return (
		<div className="order">
			<div className="order__hero">
				<h1 className="order__title">Track Order</h1>
				<div className="order__hero-right">
					<div className="status-badge"> ⏱ Preparing Now </div>
				</div>
			</div>

			<div className="order__panel">
				<aside className="order__sidebar">
					<OrderSteps/>

					<JourneyPlanner/>

					<div className="order__ready">
						<div className="order__ready-divider"></div>
						<p className="order__ready-label">Ready at</p>
						<p className="order__ready-time">11:20</p>
					</div>
				</aside>

				<div className="order__right">
					<Map/>

					<OrderDestination/>
				</div>
			</div>
			<OrderSummary/>
		</div>
	);
}
