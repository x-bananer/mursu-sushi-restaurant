import "./journey-planner.css";

import { FiChevronDown } from "react-icons/fi";
import { FaWalking, FaBicycle, FaCar, FaBus } from "react-icons/fa";

export default function JourneyPlanner() {
  return (
    <details className="accordion">
      <summary className="accordion__header">
        <span className="accordion__title">Plan Journey</span>

        <span className="accordion__icon">
          <FiChevronDown size={14} />
        </span>
      </summary>

      <div className="accordion__body accordion__body--journey journey">
        <div className="journey__modes" role="tablist">

          {/* WALK */}
          <button
            className="journey__mode-btn journey__mode-btn--active"
            type="button"
            aria-label="Walk"
          >
            <FaWalking className="journey__mode-icon" />
            <span className="journey__mode-label">Walk</span>
          </button>

          {/* BIKE */}
          <button
            className="journey__mode-btn"
            type="button"
            aria-label="Bike"
          >
            <FaBicycle className="journey__mode-icon" />
            <span className="journey__mode-label">Bike</span>
          </button>

          {/* CAR */}
          <button
            className="journey__mode-btn"
            type="button"
            aria-label="Car"
          >
            <FaCar className="journey__mode-icon" />
            <span className="journey__mode-label">Car</span>
          </button>

          {/* TRANSIT */}
          <button
            className="journey__mode-btn"
            type="button"
            aria-label="Transit"
          >
            <FaBus className="journey__mode-icon" />
            <span className="journey__mode-label">Transit</span>
          </button>

        </div>
      </div>
    </details>
  );
}
