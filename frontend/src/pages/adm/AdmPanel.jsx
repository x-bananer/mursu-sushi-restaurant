import "./adm-panel.css";
import Customers from "../../components/adm/customers/Customers";
import DailySpecial from "../../components/adm/daily-special/DailySpecial";
import AdmStatus from "../../components/adm/adm-status/AdmStatus";
import LiveOrders from "../../components/adm/live-orders/LiveOrders";
import MenuEdit from "../../components/adm/menu-edit/MenuEdit";
import Settings from "../../components/adm/settings/Settings";

export default function AdmPanel() {
    return (
        <div className="admin-main">

            {/* ── Dashboard ── */}
            <section className="admin-page admin-page--active" id="page-dashboard">
                <AdmStatus />
                <h2 className="admin-section-title">Live Order Board</h2>
                <LiveOrders />
            </section>

            <MenuEdit />

            <DailySpecial />

            <Customers />

            <Settings />

        </div>
    );
}
