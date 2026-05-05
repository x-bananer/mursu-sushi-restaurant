import './adm-status.css';
import { useStatusCount } from "../../../hooks/apiHooks/adm/liveOrders";

export default function AdmStatus() {
  const { stats, statsLoading, statsError } = useStatusCount();

  if (statsLoading) {
    return <div className="admin-stats">Loading stats...</div>;
  }

  if (statsError) {
    return <div className="admin-stats">Error: {statsError}</div>;
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
        <p className="stat-card__label">Total Orders Today</p>
        <p className="stat-card__value">{total}</p>
      </div>

      <div className="stat-card">
        <p className="stat-card__label">Still Pending Today</p>
        <p className="stat-card__value">
          {(stats.pending || 0) + (stats.confirmed || 0)}
        </p>
      </div>

      <div className="stat-card">
        <p className="stat-card__label">Total Ready Today</p>
        <p className="stat-card__value">{stats.ready || 0}</p>
      </div>

      <div className="stat-card">
        <p className="stat-card__label">Total Delivered Today</p>
        <p className="stat-card__value">{stats.delivered || 0}</p>
      </div>
    </div>
  );
}
