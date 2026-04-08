import type { Route } from "../customer/+types/OrderTracker";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Order Tracking | Mursu Sushi" },
    { name: "description", content: "Track your Mursu Sushi order in real-time.", },
  ];
}

export default function OrderTracker() {
  return <h1>Order Tracker</h1>;
}