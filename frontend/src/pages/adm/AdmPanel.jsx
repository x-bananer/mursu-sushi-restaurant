import { useTranslation } from "react-i18next";
import AdmStatus from "../../components/adm/adm-status/AdmStatus";
import LiveOrders from "../../components/adm/live-orders/LiveOrders";

export default function AdmPanel() {
	const { t } = useTranslation();

	return (
		<section className="admin-main">
			<AdmStatus />
			<h2 className="admin-section-title">
				{t("admin.live_order_board")}
			</h2>
			<LiveOrders />
		</section>
	);
}
