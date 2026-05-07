import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import LiveOrdersColumn from "./LiveOrdersColumn";
import "./live-orders.css";

import {
	useAdmOrders,
	useAdmOrderStream,
	useUpdateOrderStatus,
} from "../../../hooks/apiHooks/adm/liveOrders";

const getNextStatus = (status) => {
	if (status === "pending") return "confirmed";
	if (status === "confirmed") return "preparing";
	if (status === "preparing") return "ready";
	if (status === "ready") return "delivered";
	return null;
};

export default function LiveOrders() {
	const { t } = useTranslation();
	const { orders: initialOrders } = useAdmOrders();
	const [orders, setOrders] = useState([]);
	const { updateStatus } = useUpdateOrderStatus();

	useEffect(() => {
		setOrders(initialOrders);
	}, [initialOrders]);

	/**
	 * SSE updater
	 */
	const handleStreamEvent = useCallback((event) => {
		setOrders((prev) => {
			const type = event.type;
			const payload = event.payload;

			// ─────────────────────────────────────────
			// ORDER CREATED
			// ─────────────────────────────────────────
			if (type === "order_created") {
				return [payload, ...prev];
			}

			// ─────────────────────────────────────────
			// STATUS UPDATED
			// ─────────────────────────────────────────
			if (type === "order_status_updated") {
				return prev.map((order) =>
					order.id === payload.id ? payload : order,
				);
			}

			return prev;
		});
	}, []);

	useAdmOrderStream(handleStreamEvent);

	// ─────────────────────────────────────────
	// GROUPING
	// ─────────────────────────────────────────
	const pendingOrders = orders.filter(
		(o) => o.status?.type === "pending" || o.status?.type === "confirmed",
	);
	const preparingOrders = orders.filter(
		(o) => o.status?.type === "preparing",
	);
	const readyOrders = orders.filter((o) => o.status?.type === "ready");

	// ─────────────────────────────────────────
	// HANDLE UPDATE
	// ─────────────────────────────────────────
	const handleAction = async (orderId) => {
		const order = orders.find((o) => o.id === orderId);
		if (!order) return;

		const currentStatus = order.status?.type;
		const nextStatus = getNextStatus(currentStatus);

		if (!nextStatus) return;

		/**
		 * ─────────────────────────────────────────
		 * OPTIMISTIC UPDATE (instant UI)
		 * ─────────────────────────────────────────
		 */
		setOrders((prev) =>
			prev.map((o) =>
				o.id === orderId
					? { ...o, status: { ...o.status, type: nextStatus } }
					: o,
			),
		);

		/**
		 * ─────────────────────────────────────────
		 * API CALL
		 * ─────────────────────────────────────────
		 */
		try {
			await updateStatus(orderId, nextStatus);
		} catch (err) {
			console.error("Failed to update order:", err);

			/**
			 * ─────────────────────────────────────────
			 * ROLLBACK (if API fails)
			 * ─────────────────────────────────────────
			 */
			setOrders((prev) =>
				prev.map((o) => (o.id === orderId ? order : o)),
			);
		}
	};

	return (
		<div className="order-board">
			<LiveOrdersColumn
				title={t("admin.pending")}
				status="pending"
				orders={pendingOrders}
				onAction={handleAction}
			/>

			<LiveOrdersColumn
				title={t("admin.preparing")}
				status="preparing"
				orders={preparingOrders}
				onAction={handleAction}
			/>

			<LiveOrdersColumn
				title={t("admin.ready")}
				status="ready"
				orders={readyOrders}
				onAction={handleAction}
			/>
		</div>
	);
}
