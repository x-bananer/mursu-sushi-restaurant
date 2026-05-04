import {useState} from 'react'

import './cart-delivery.css'

import InputField from '../../shared/input-field/InputField';

export default function CartDelivery() {
    const [address, setAddress] = useState("Testikatu 12 A 4, Helsinki");

    return (
        <div className="cart-delivery">
            <h2 className="cart-delivery__title">Delivery</h2>
            <div className="cart-delivery__options">
                <button
                    className="cart-delivery__option cart-delivery__option--active"
                    type="button"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx={6} cy={17} r={2} />
                        <circle cx={18} cy={17} r={2} />
                        <path d="M6 17h8l2-5h3" />
                        <path d="M10 12h5" />
                        <path d="M6 17l3-7h5" />
                    </svg>
                    <span className="cart-delivery__label">Delivery</span>
                </button>
                <button className="cart-delivery__option" type="button">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 3v7"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                        />
                        <path
                            d="M8 3v7"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                        />
                        <path
                            d="M10 3v7"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                        />
                        <path
                            d="M8 10v11"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                        />
                        <path
                            d="M16 3v18"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                        />
                        <path
                            d="M16 3c-2 2-2 6 0 8"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="cart-delivery__label">Dine-in</span>
                </button>
                <button className="cart-delivery__option" type="button">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 8h12l-1 12H7L6 8z"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9 8V6a3 3 0 0 1 6 0v2"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="cart-delivery__label">Pickup</span>
                </button>
            </div>
            <InputField
                placeholder="Enter the delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
        </div>
    )
}
