import LiveOrdersColumn from "./LiveOrdersColumn";
import "./live-orders.css";

import { useAdmOrders } from "../../../hooks/apiHooks/adm/liveOrders";

export default function LiveOrders() {
	const { orders, loadOrders, ordersLoading, ordersError } = useAdmOrders();

	console.log('orders: ', orders)

	const pendingOrders = orders.filter(
  		o => o.status?.type === "pending" || o.status?.type === "confirmed"
	);
	const preparingOrders = orders.filter(o => o.status?.type === "preparing");
	const readyOrders = orders.filter(o => o.status?.type === "ready");

	console.log('pending and confirmed orders: ', pendingOrders)

	console.log('preparingOrders: ', preparingOrders)
	console.log('readyOrders: ', readyOrders)

	const handleAction = (orderId) => {
		console.log("Action clicked for order:", orderId);
	};

	return (
		<div className="order-board">
			<LiveOrdersColumn
				title="Pending"
				status="pending"
				orders={pendingOrders}
				onAction={handleAction}
			/>

			<LiveOrdersColumn
				title="Preparing"
				status="preparing"
				orders={preparingOrders}
				onAction={handleAction}
			/>

			<LiveOrdersColumn
				title="Ready"
				status="ready"
				orders={readyOrders}
				onAction={handleAction}
			/>
		</div>
	);
}
