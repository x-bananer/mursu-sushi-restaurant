import "./order-tracker.css";
import { useEffect, useState } from "react";

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
  const { order, loading, error } = useActiveOrder();
  const status = useOrderStream(order?.id);
  const { history, loadTracking } = useOrderTracking(order?.id);
  const { lat, lon, loading: geoLoading, error: geoError} = useGeolocation();
  const {etaEstimation, etaLoading, etaError} = useEtaEstimation(order?.id, lat, lon);
  const [selectedMode, setSelectedMode] = useState(null);
  const {
    route, routeLoading, routeError
  } = useRouteByMode(order?.id, lat, lon, selectedMode);

  useEffect(() => {
    if (!status?.status?.type) return;
    loadTracking();
  }, [status]);

  console.group("ORDER TRACKER DEBUG");
  console.log("Order:", order);
  console.log("Status:", status);
  console.log("Geolocation ", { lat, lon, geoLoading, geoError });
  console.log("ETA:", {etaEstimation, etaLoading, etaError});
  console.log("ROUTE BY MODE:", {route, routeLoading, routeError});
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
            recommendedMode={etaEstimation?.recommendedMode}
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
          />

          {/* ETA */}
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
            geometry={route?.geometry || etaEstimation?.travel?.geometry}
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
