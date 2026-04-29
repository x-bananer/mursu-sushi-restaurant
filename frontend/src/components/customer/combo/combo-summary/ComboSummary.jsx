import './combo-summary.css';

import Button from '../../../shared/button/Button';
import ComboLayer from '../combo-layer/ComboLayer';

export default function ComboSummary() {
    return (
        <aside className="combo-summary">
            <div className="combo-summary__container">
                <h2 className="combo-summary__title">Your Set</h2>
                <div className="combo-summary__stack">
                    <ComboLayer isFixed />
                    <ComboLayer isDraggable />
                    <ComboLayer isFixed />
                </div>
                <div className="combo-summary__totals">
                    <div className="combo-summary__row">
                        <span className="combo-summary__label">
                            Added toppings
                        </span>
                        <span className="combo-summary__value">6.00</span>
                    </div>
                    <div className="combo-summary__row">
                        <span className="combo-summary__label">
                            Added fillings
                        </span>
                        <span className="combo-summary__value">34.00</span>
                    </div>
                    <div className="combo-summary__row">
                        <span className="combo-summary__label">
                            Added base
                        </span>
                        <span className="combo-summary__value">10.00</span>
                    </div>
                </div>
                <div className="combo-summary__total">
                    <span className="combo-summary__total-label">
                        Total
                    </span>
                    <span className="combo-summary__total-value">
                        50.00
                    </span>
                </div>
                <Button className="combo-summary__button">
                    Add to cart
                </Button>
            </div>
        </aside>
    )
}
