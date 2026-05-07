import { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { FaCar, FaUtensils, FaWalking } from 'react-icons/fa'

import './cart-delivery.css'

import InputField from '../../../shared/input-field/InputField';
import { useDeliveryTypes } from '../../../../hooks/apiHooks/cart';

export default function CartDelivery({
    deliveryTypeId,
    setDeliveryTypeId,
    address,
    setAddress,
    setSelectedDeliveryType,
}) {
    const { t } = useTranslation();
    const { deliveryTypes, deliveryTypesLoading, deliveryTypesError } = useDeliveryTypes();

    const activeTypeId = deliveryTypeId ?? deliveryTypes[0]?.id ?? null;
    const selectedType = deliveryTypes.find((type) => type.id === activeTypeId) || null;
    const isDeliverySelected = selectedType?.type === 'delivery';

    useEffect(() => {
        setSelectedDeliveryType(selectedType);
    }, [selectedType, setSelectedDeliveryType]);

    const getDeliveryTypeIcon = (type) => {
        if (type === 'delivery') return <FaCar />;
        if (type === 'restaurant') return <FaUtensils />;
        if (type === 'pickup') return <FaWalking />;
        return <FaCar />;
    }

    return (
        <div className="cart-delivery">
            <h2 className="cart-delivery__title">{t("cart.delivery_title")}</h2>
            <div className="cart-delivery__options">
                {deliveryTypesLoading && <span className="cart-delivery__label">{t("cart.delivery_loading")}</span>}
                {deliveryTypesError && <span className="cart-delivery__label">{deliveryTypesError}</span>}
                {!deliveryTypesLoading && !deliveryTypesError && deliveryTypes.map((type) => (
                    <button
                        key={type.id}
                        className={`cart-delivery__option ${activeTypeId === type.id ? 'cart-delivery__option--active' : ''}`}
                        type="button"
                        onClick={() => setDeliveryTypeId(type.id)}
                    >
                        {getDeliveryTypeIcon(type.type)}
                        <span className="cart-delivery__label">{type.name}</span>
                    </button>
                ))}
            </div>
            {isDeliverySelected && (
                <InputField
                    placeholder={t("cart.delivery_address_placeholder")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            )}
        </div>
    )
}
