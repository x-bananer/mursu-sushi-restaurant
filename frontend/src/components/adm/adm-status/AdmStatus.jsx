import "./adm-status.css";
import { useTranslation } from "react-i18next";
import { useStatusCount } from "../../../hooks/apiHooks/adm/liveOrders";

export default function AdmStatus() {
	const { t } = useTranslation();
	const { stats, statsLoading, statsError } = useStatusCount();

	if (statsLoading) {
		return <div className="admin-stats">{t("admin.status_loading")}</div>;
	}

	if (statsError) {
		return (
			<div className="admin-stats">
				{t("admin.stats_error_prefix")} {statsError}
			</div>
		);
	}

	const total =
		(stats.pending || 0) +
		(stats.confirmed || 0) +
		(stats.preparing || 0) +
		(stats.ready || 0) +
		(stats.delivered || 0);

	return (
		<div className="admin-stats">
			<div className="stat-card">
				<p className="stat-card__label">
					{t("admin.total_orders_today")}
				</p>
				<p className="stat-card__value">{total}</p>
			</div>

			<div className="stat-card">
				<p className="stat-card__label">{t("admin.pending_today")}</p>
				<p className="stat-card__value">
					{(stats.pending || 0) + (stats.confirmed || 0)}
				</p>
			</div>

			<div className="stat-card">
				<p className="stat-card__label">{t("admin.ready_today")}</p>
				<p className="stat-card__value">{stats.ready || 0}</p>
			</div>

			<div className="stat-card">
				<p className="stat-card__label">{t("admin.delivered_today")}</p>
				<p className="stat-card__value">{stats.delivered || 0}</p>
			</div>
		</div>
	);
}
