import { useState } from 'react'

import './cart-delivery.css'

import InputField from '../../../shared/input-field/InputField';
import { useDeliveryTypes } from '../../../../hooks/apiHooks/cart';

const DeliveryIcon = () => (
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
);

const DineInIcon = () => (
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
);

const PickupIcon = () => (
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
);

export default function CartDelivery() {
    const [address, setAddress] = useState("");
    const { deliveryTypes, deliveryTypesLoading, deliveryTypesError } = useDeliveryTypes();
    const [selectedTypeId, setSelectedTypeId] = useState(null);

    const activeTypeId = selectedTypeId || deliveryTypes[0]?.id || null;
    const selectedType = deliveryTypes.find((type) => type.id === activeTypeId) || null;
    const isDeliverySelected = selectedType?.type === 'delivery';

    const getDeliveryTypeIcon = (type) => {
        if (type === 'delivery') return <DeliveryIcon />;
        if (type === 'restaurant') return <DineInIcon />;
        if (type === 'pickup') return <PickupIcon />;
        return <DeliveryIcon />;
    }

    return (
        <div className="cart-delivery">
            <h2 className="cart-delivery__title">Delivery</h2>
            <div className="cart-delivery__options">
                {deliveryTypesLoading && <span className="cart-delivery__label">Loading...</span>}
                {deliveryTypesError && <span className="cart-delivery__label">{deliveryTypesError}</span>}
                {!deliveryTypesLoading && !deliveryTypesError && deliveryTypes.map((type) => (
                    <button
                        key={type.id}
                        className={`cart-delivery__option ${activeTypeId === type.id ? 'cart-delivery__option--active' : ''}`}
                        type="button"
                        onClick={() => setSelectedTypeId(type.id)}
                    >
                        {getDeliveryTypeIcon(type.type)}
                        <span className="cart-delivery__label">{type.name}</span>
                    </button>
                ))}
            </div>
            {isDeliverySelected && (
                <InputField
                    placeholder="Enter the delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            )}
        </div>
    )
}
