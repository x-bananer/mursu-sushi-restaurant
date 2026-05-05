import "./table-base.css";

export default function TableBase({
  title,
  description,
  columns,
  data,
  renderRow,
}) {
  return (
    <section className="table-wrapper">
      {title && <h3 className="menu-page__title">{title}</h3>}
      {description && (
        <p className="placeholder-text">{description}</p>
      )}

      <div className="table">
        {/* HEADER */}
        <div className="table__head">
          {columns.map((col) => (
            <span key={col.key}>{col.label}</span>
          ))}
          <span className="table__actions">Actions</span>
        </div>

        {/* ROWS */}
        {data.map((item, index) =>
          renderRow ? (
            renderRow(item, index)
          ) : (
            <div className="table__row" key={item.id}>
              {columns.map((col) => (
                <span key={col.key}>{item[col.key]}</span>
              ))}
              <span className="table__actions" />
            </div>
          )
        )}
      </div>
    </section>
  );
}
