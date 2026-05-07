import { useEffect, useState } from "react";
import { fetchData } from "../../../utils/fetchData";

export const useAdmOrders = () => {
	const [orders, setOrders] = useState([]);
	const [ordersLoading, setOrdersLoading] = useState(true);
	const [ordersError, setOrdersError] = useState(null);

	const loadOrders = async () => {
		try {
			setOrdersLoading(true);
			setOrdersError(null);

			const response = await fetchData("/adm/orders", {
				method: "GET",
			});

			setOrders(response.orders || []);
		} catch (err) {
			setOrdersError(err.message);
		} finally {
			setOrdersLoading(false);
		}
	};

	useEffect(() => {
		loadOrders();
	}, []);

	return { orders, loadOrders, ordersLoading, ordersError };
};

export const useAdmOrderStream = (onEvent) => {
	useEffect(() => {
		const url = `${import.meta.env.VITE_API_BASE_URL}/adm/orders/stream`;

		const eventSource = new EventSource(url);

		eventSource.addEventListener("order_created", (e) => {
			onEvent(JSON.parse(e.data));
		});

		eventSource.addEventListener("order_status_updated", (e) => {
			onEvent(JSON.parse(e.data));
		});

		return () => eventSource.close();
	}, [onEvent]);
};

export const useUpdateOrderStatus = () => {
	const [statusLoading, setStatusLoading] = useState(false);
	const [statusError, setStatusError] = useState(null);

	const updateStatus = async (orderId, status) => {
		if (!orderId || !status) return;

		try {
			setStatusLoading(true);
			setStatusError(null);

			await fetchData(`/adm/orders/${orderId}/status`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status }),
			});
		} catch (err) {
			setStatusError(err.message);
		} finally {
			setStatusLoading(false);
		}
	};

	return { updateStatus, statusLoading, statusError };
};

export const useStatusCount = () => {
	const [stats, setStats] = useState({});
	const [statsLoading, setStatsLoading] = useState(true);
	const [statsError, setStatsError] = useState(null);

	const loadStats = async () => {
		try {
			setStatsLoading(true);
			setStatsError(null);

			const response = await fetchData("/adm/orders/status/count", {
				method: "GET",
			});

			const normalized = Object.fromEntries(
				(response.stats || []).map(({ status, count }) => [
					status,
					Number(count),
				]),
			);

			setStats(normalized);
		} catch (err) {
			setStatsError(err.message);
		} finally {
			setStatsLoading(false);
		}
	};

	useEffect(() => {
		loadStats();
	}, []);

	return { stats, loadStats, statsLoading, statsError };
};
