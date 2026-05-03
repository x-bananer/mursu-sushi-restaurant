import "./order-steps.css";
import { FiChevronDown } from "react-icons/fi";

const STEPS = [
  {
    key: "pending",
    label: "Placed",
    message: (formattedTime, orderId) =>
      `${formattedTime} — Payment confirmed via Stripe. Your order id is ${orderId}.`,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    message: (formattedTime) =>  `${formattedTime} — Kitchen has received your order.`,
  },
  {
    key: "preparing",
    label: "Preparing",
    message: (formattedTime) =>  `${formattedTime} — Your sushi is now being processed.`,
  },
  {
    key: "ready",
    label: "Ready",
    message: (formattedTime, orderId, serviceType) => {
      const messages = {
        delivery:
           `${formattedTime} — We are now coming to you, be ready to receive your delivery.`,
        pickup:  `${formattedTime} — We are ready, just waiting for you now.`,
        restaurant:  `${formattedTime} — Enjoy your meal!`,
      };

      return messages[serviceType] || "— Your order is ready.";
    },
  },
];

function formatTime(time) {
  if (!time) return "";

  return new Date(time).toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderSteps({
  history = [],
  orderId,
  serviceType,
}) {
  console.group("ORDER STEPS DEBUG");
  console.log("history:", history);
  console.log("orderId ", orderId);
  console.log("serviceType ", serviceType);
  console.groupEnd();

  // Build index-based lookup
  const historyByIndex = {};
  history.forEach((item) => {
    const index = item.status_id - 1;

    if (index >= 0 && index < STEPS.length) {
      historyByIndex[index] = item.changed_at;
    }
  });

  // clamp current index
  const currentIndex = Math.min(
    Math.max(...history.map((item) => item.status_id - 1), 0),
    STEPS.length - 1
  );

  const getStepState = (index) => {
    if (index < currentIndex) return "done";
    if (index === currentIndex) return "active";
    return "pending";
  };

  return (
    <details className="accordion" open>
      <summary className="accordion__header">
        <span className="accordion__title">Order Status</span>

        <span className="accordion__icon">
          <FiChevronDown size={14} />
        </span>
      </summary>

      <div className="accordion__body">
        <ul className="order-steps">
          {STEPS.map((step, index) => {
            const state = getStepState(index);

            const stepTime = historyByIndex[index];
            const formattedTime = formatTime(stepTime);

            let message = "";

            if (stepTime) {
              message = step.message(
                formattedTime,
                orderId,
                serviceType
              );
            } else if (index > currentIndex) {
              message = "";
            }

            return (
              <li
                key={step.key}
                className={`order-step order-step--${state}`}
              >
                <span className="order-step__dot" />

                <div>
                  <p className="order-step__label">{step.label}</p>
                  <p className="order-step__meta">{message}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
