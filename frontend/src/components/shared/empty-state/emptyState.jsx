import "./empty-state.css";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
