import "./order-eta.css";

/* ----------------------------
   Formatters
----------------------------- */
function formatTime(time) {
  if (!time) return "--:--";

  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ----------------------------
   ETA Mapping
----------------------------- */
const ETA = {
  delivery: {
    row1: {
      before: "Estimated ready by:",
      value: (eta) => formatTime(eta?.readyAt),
      after: "",
    },
    row2: {
      before: "Delivered by:",
      value: (eta) => formatTime(eta?.deliveredAt),
      after: "",
    },
  },

  pickup: {
    row1: {
      before: "Estimated ready by:",
      value: (eta) => formatTime(eta?.readyAt),
      after: "Make sure to leave on time!",
    },
    row2: {
      before: "From your location it takes about",
      value: (eta, durationMins) => `${durationMins ?? eta?.travel?.durationMins ?? "--"}`,
      unit: "min",
      after: "to get to the restaurant.",
    },
  },

  dine_in: {
    row1: {
      before: "Table ready at:",
      value: (eta) => formatTime(eta?.readyAt),
      after: "Make sure to be at the restaurant by then!",
    },
    row2: {
      before: "From your location it takes about",
      value: (eta, durationMins) => `${durationMins ?? eta?.travel?.durationMins ?? "--"}`,
      unit: "min",
      after: "to reach the restaurant.",
    },
  },

  default: {
    row1: {
      before: "Estimated time in min:",
      value: (eta) => `${eta?.travel?.durationMins ?? "--"}`,
      unit: "min",
      after: "",
    },
  },
};

/* ----------------------------
   Component
----------------------------- */
export default function OrderETA({ eta, serviceType, durationMins }) {
  console.log('serviceType: ', serviceType);
  console.log('eta?.leaveAt: ', eta?.deliveredAt );
  if (serviceType === 'restaurant') serviceType = 'dine_in';
  const etaUI = ETA[serviceType] || ETA.default;

  if (!eta) {
    return (
      <div className="order__ready-wrapper">
        <p className="order__ready-label">Estimating time...</p>
      </div>
    );
  }

  return (
    <div className="order__ready-wrapper">
      {/* Row 1 */}
      <div className="order__ready">
        <p className="order__ready-label">{etaUI?.row1?.before}</p>

        <p className="order__ready-time">
          {etaUI?.row1?.value?.(eta)}
        </p>

        {etaUI?.row1?.after && (
          <p className="order__ready-label">{etaUI?.row1?.after}</p>
        )}
      </div>

      {/* Row 2 */}
      {serviceType === "delivery" ? (
        <div className="order__ready">
        <p className="order__ready-label">{etaUI?.row2?.before}</p>

        <p className="order__ready-time">
          {etaUI?.row2?.value?.(eta)}
        </p>

        {etaUI?.row2?.after && (
          <p className="order__ready-label">{etaUI?.row2?.after}</p>
        )}
      </div>

      ) : (

        <div className="order__ready">
          <p className="order__ready-label">{etaUI?.row2?.before}</p>

          <span className="order__ready-time">
            {etaUI?.row2?.value?.(eta, durationMins)}
          </span>

          {etaUI?.row2?.unit && (
            <span className="order__ready-label">
              {" "}{etaUI?.row2?.unit}
            </span>
          )}

          {etaUI?.row2?.after && (
            <p className="order__ready-label">{etaUI?.row2?.after}</p>
          )}
        </div>
      )}
    </div>
  );
}
