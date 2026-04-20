import LiveOrdersColumn from "./LiveOrdersColumn";

export default function LiveOrders() {
	const pendingOrders = [
		{
			id: 1042,
			time: "12:34",
			name: "Matti K.",
			total: "27.21",
			items: [
				{ name: "Sake sashimi", qty: 1 },
				{ name: "Maguro nigiri", qty: 2 },
			],
		},
		{
			id: 1045,
			time: "12:38",
			name: "Guest",
			total: "14.50",
			items: [{ name: "Ebi Tempura Roll", qty: 1 }],
		},
	];

	const preparingOrders = [
		{
			id: 1040,
			time: "12:20",
			name: "Anna S.",
			total: "32.00",
			items: [
				{ name: "Unagi Kabayaki", qty: 1 },
				{ name: "Miso Soup", qty: 2 },
			],
		},
	];

	const readyOrders = [
		{
			id: 1038,
			time: "12:15",
			name: "Guest",
			total: "12.80",
			items: [{ name: "California Roll", qty: 1 }],
		},
	];

	const handleAction = (orderId) => {
		console.log("Action clicked for order:", orderId);
	};

	return (
		<div className="order-board">
			<LiveOrdersColumn
				title="Pending"
				status="pending"
				orders={pendingOrders}
				actionLabel="Mark Preparing"
				onAction={handleAction}
			/>

			<LiveOrdersColumn
				title="Preparing"
				status="preparing"
				orders={preparingOrders}
				actionLabel="Mark Ready"
				onAction={handleAction}
			/>

			<LiveOrdersColumn
				title="Ready"
				status="ready"
				orders={readyOrders}
				actionLabel="Complete"
				onAction={handleAction}
			/>
		</div>
	);
}
