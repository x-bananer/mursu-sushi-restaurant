import "./order-summary.css";

export default function OrderSummary({orderId, items =[], totalPrice}) {
	console.log('items: ', items);
	return (
    <div className="order__bottom">
      <div className="order-summary">
        <p className="order-summary__label">Order — id: {orderId}</p>

        <ul className="order-summary__items">
          {items.map((item, index) => {
            const isDish = item.type?.type === "dish";
            const isCustom = item.type?.type === "custom";

            let name = "";
            let price = Number(item.price).toFixed(2);

            if (isDish) {
              name = item.dish?.name || "Unknown dish";
            }

            if (isCustom) {
              name = item.type?.name || "Custom Combo";
            }

            return (
              <li key={index} className="order-summary__item">
                <span className="order-summary__name">
                  {String(item.quantity).padStart(2, "0")} {name}
                </span>

                <span className="order-summary__price">
                  ${price}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="order-user">
        <p className="order-user__text">
          Any active rewards or discounts are automatically applied to your order.
        </p>
      </div>

      <div className="order-price">
        <p className="order-price__label">Total Price</p>
        <p className="order-price__value">
          ${Number(totalPrice).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
