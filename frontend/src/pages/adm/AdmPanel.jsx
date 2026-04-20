import AdmStatus from "../../components/adm/adm-status/AdmStatus";
import LiveOrders from "../../components/adm/live-orders/LiveOrders";

export default function AdmPanel() {
	return (
				<section className="admin-main">
					<AdmStatus />
					<h2 className="admin-section-title">
						Live Order Board
					</h2>
					<LiveOrders />
				</section>

	);
}
