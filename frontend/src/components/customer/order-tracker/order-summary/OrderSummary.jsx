import "./order-summary.css";
import { useTranslation } from "react-i18next";

export default function OrderSummary({orderId, items =[], totalPrice}) {
	const { t } = useTranslation();
	console.log('items: ', items);
	return (
    <div className="order__bottom">
      <div className="order-summary">
        <p className="order-summary__label">{t("order_tracker.order_id", { id: orderId })}</p>

        <ul className="order-summary__items">
          {items.map((item, index) => {
            const isDish = item.type?.type === "dish";
            const isCustom = item.type?.type === "custom";

            let name = "";
            let price = Number(item.price).toFixed(2);

            if (isDish) {
              name = item.dish?.name || t("cart.unknown_dish");
            }

            if (isCustom) {
              name = item.type?.name || t("admin.custom_combo");
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
          {t("order_tracker.rewards_note")}
        </p>
      </div>

      <div className="order-price">
        <p className="order-price__label">{t("order_tracker.total_price")}</p>
        <p className="order-price__value">
          ${Number(totalPrice).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
