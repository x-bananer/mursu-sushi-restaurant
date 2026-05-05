export default function LiveOrdersCard({ order, onAction }) {
  const status = order.status?.type;

  let actionLabel = "";
  let nextStatus = null;

  if (status === "pending") {
    actionLabel = "Accept Order";
    nextStatus = "confirmed";
  } else if (status === "confirmed") {
    actionLabel = "Mark Preparing";
    nextStatus = "preparing";
  } else if (status === "preparing") {
    actionLabel = "Mark Ready";
    nextStatus = "ready";
  } else if (status === "ready") {
    actionLabel = "Mark Delivered";
    nextStatus = "delivered";
  }

  const renderItem = (item) => {
    const type = item.type?.type;

    const name =
      type === "dish"
        ? item.dish?.name
        : "Custom Combo";

    return (
      <li key={item.id} className="order-card__item">
        {/* MAIN LINE */}
        <div className="order-card__item-row">
          <span className="order-card__item-name">
            {name}
          </span>

          <span className="order-card__qty">
            x{item.quantity}
          </span>
        </div>

        {/* COMBO INGREDIENTS */}
        {type === "custom" && item.ingredients?.length > 0 && (
          <div className="order-card__ingredients">
            {item.ingredients.map((ing) => (
              <div
                key={ing.id}
                className="order-card__ingredient"
              >
                | {ing.ingredient?.name}
              </div>
            ))}
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="order-card">
      {/* HEADER */}
      <div className="order-card__top">
        <span className="order-card__id">#{order.id}</span>
        <span className="order-card__time">
          {new Date(order.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* CUSTOMER */}
      <p className="order-card__name">
        {order.user?.name ?? order.address}
      </p>

      {/* ITEMS */}
      <ul className="order-card__items">
        {order.order_items?.map(renderItem)}
      </ul>

      {/* FOOTER */}
      <div className="order-card__footer">
        <span className="order-card__total">
          EUR {order.total_price}
        </span>

        {nextStatus && (
          <button
            className="btn btn--xsmall"
            type="button"
            onClick={() => onAction(order.id, nextStatus)}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
