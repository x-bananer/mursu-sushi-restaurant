import './combo-layer.css';

import Button from '../../../shared/button/Button';

export default function ComboLayer({ isFixed }) {
    return (
        <article className={`combo-layer ${isFixed ? 'combo-layer--fixed' : 'combo-layer--draggable'}`}>
            {isFixed ?
                <div className="combo-layer__aside combo-layer__aside--left">
                    <svg
                        className="combo-layer__lock"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8 10V7.5C8 5.567 9.567 4 11.5 4H12.5C14.433 4 16 5.567 16 7.5V10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <rect
                            x="6.5"
                            y={10}
                            width={11}
                            height={9}
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </div>
                :
                <div className="combo-layer__aside combo-layer__aside--left">
                    <span className="combo-layer__handle">⋮⋮</span>
                </div>
            }


            <div className="combo-layer__main">
                <p className="combo-layer__title">Shari Rice</p>
                <p className="combo-layer__type">Bottom Base</p>
            </div>
            <div className="combo-layer__aside combo-layer__aside--right">
                <span className="combo-layer__price">5.00</span>
                <Button
                    className="combo-layer__btn"
                    variant="link"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7 7L17 17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M17 7L7 17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </Button>
            </div>
        </article>
    )
}
