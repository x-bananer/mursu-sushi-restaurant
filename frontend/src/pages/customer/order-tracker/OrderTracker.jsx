import "./order-tracker.css";
import { useEffect } from "react";

import OrderSteps from "../../../components/customer/order-tracker/order-steps/OrderSteps";
import JourneyPlanner from "../../../components/customer/order-tracker/journey-planner/JourneyPlanner";
import Map from "../../../components/customer/order-tracker/map/Map";
import OrderDestination from "../../../components/customer/order-tracker/order-destination/OrderDestination";
import OrderSummary from "../../../components/customer/order-tracker/order-summary/OrderSummary";

import { useActiveOrder, useOrderStream, useOrderTracking } from "../../../hooks/apiHooks/orderTracker";
import { useGeolocation } from "../../../hooks/apiHooks/geolocation";

import Loader from "../../../components/shared/loader/Loader";
import ErrorState from "../../../components/shared/error-state/errorState";
import EmptyState from "../../../components/shared/empty-state/emptyState";

export default function OrderTracker() {
  const { order, loading, error } = useActiveOrder();
  const status = useOrderStream(order?.id);
  const { history, loadTracking } = useOrderTracking(order?.id);
  const {
    lat,
    lon,
    loading: geoLoading,
    error: geoError
  } = useGeolocation();

  useEffect(() => {
    if (!status?.status?.type) return;

    loadTracking();
  }, [status]);

  console.group("ORDER TRACKER DEBUG");
  console.log("Order:", order);
  console.log("Status:", status);
  console.log("Geolocation ", { lat, lon, geoLoading, geoError });
  console.groupEnd();

   if (loading) {
    return (
      <div className="order">
        <Loader text="Loading order..." />
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
          title="No active orders"
          description="Go to menu and place your order, Make sure you checkout in your cart."
        />
      </div>
    );
  }

	return (
		<div className="order">
			{/* HERO */}
			<div className="order__hero">
				<h1 className="order__title">Track Order</h1>
				<div className="order__hero-right">
					<div className="status-badge"> ⏱ {status?.status?.name ?? order?.status?.name} </div>
				</div>
			</div>

			<div className="order__panel">
				<aside className="order__sidebar">
					{/* LIVE STREAM */}
					<OrderSteps
            history={history}
            orderId={order?.id}
            serviceType={order.delivery_type.type}
          />

					<JourneyPlanner/>

					{/* ETA */}
					<p className="order__estimation">Estimation: </p>
					<div className="order__ready-wrapper">
					<div className="order__ready">
						<p className="order__ready-label">Ready at</p>
						<p className="order__ready-time">11:20</p>
					</div>
					<div className="order__ready">
						<p className="order__ready-label">Leave at</p>
						<p className="order__ready-time">11:00</p>
					</div>
					</div>
				</aside>

				<div className="order__right">
					{/* MAP */}
					<Map/>

					<OrderDestination address={order.address} serviceType={order.delivery_type.type} />
				</div>
			</div>
			<OrderSummary orderId={order.id} items={order.order_items} totalPrice={order.total_price}/>
		</div>
	);
}
