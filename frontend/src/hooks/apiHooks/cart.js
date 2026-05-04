import { useEffect, useState } from 'react';
import { fetchData } from '../../utils/fetchData';

const useCart = (sessionId) => {
    const [cart, setCart] = useState(null);
    const [loadLoading, setLoadLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setCart(null);
            setLoadLoading(false);
            return;
        }

        const loadCart = async () => {
            try {
                setLoadLoading(true);
                setLoadError(null);

                const response = await fetchData('/cart');

                setCart(response?.cart ?? null);
            } catch (err) {
                setLoadError(err.message);
            } finally {
                setLoadLoading(false);
            }
        };

        loadCart();

    }, [sessionId]);

    return { cart, setCart, loadLoading, loadError };
};

const useCartActions = () => {
    const [cartActionLoading, setCartActionLoading] = useState(false);
    const [cartActionError, setCartActionError] = useState(null);

    const addDishToCart = async (sessionId, dishId, quantity) => {
        try {
            setCartActionLoading(true);
            setCartActionError(null);

            const response = await fetchData('/cart', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dish_id: dishId,
                    quantity,
                }),
            });

            return response?.cart ?? null;
        } catch (err) {
            setCartActionError(err.message);
            return null;
        } finally {
            setCartActionLoading(false);
        }
    };

    const addComboToCart = async (ingredients) => {
        try {
            setCartActionLoading(true);
            setCartActionError(null);

            const response = await fetchData('/dishes/combo/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients }),
            });

            return response?.cart ?? null;
        } catch (err) {
            setCartActionError(err.message);
            return null;
        } finally {
            setCartActionLoading(false);
        }
    };

    const updateCartItems = async (items) => {
        try {
            setCartActionLoading(true);
            setCartActionError(null);

            const response = await fetchData('/cart', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items }),
            });

            return response?.cart ?? null;
        } catch (err) {
            setCartActionError(err.message);
            return null;
        } finally {
            setCartActionLoading(false);
        }
    };

    return { addDishToCart, addComboToCart, updateCartItems, cartActionLoading, cartActionError };
};

const usePayment = () => {
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const createPayment = async ({ deliveryTypeId, address, paymentMethodId }) => {
        try {
            setPaymentLoading(true);
            setPaymentError(null);

            return await fetchData('/payments/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    delivery_type_id: deliveryTypeId,
                    address,
                    payment_method_id: paymentMethodId,
                }),
            });
        } catch (err) {
            setPaymentError(err.message);
            return null;
        } finally {
            setPaymentLoading(false);
        }
    };

    return { createPayment, paymentLoading, paymentError };
};

const useDeliveryTypes = () => {
    const [deliveryTypes, setDeliveryTypes] = useState([]);
    const [deliveryTypesLoading, setDeliveryTypesLoading] = useState(false);
    const [deliveryTypesError, setDeliveryTypesError] = useState(null);

    useEffect(() => {
        const loadDeliveryTypes = async () => {
            try {
                setDeliveryTypesLoading(true);
                setDeliveryTypesError(null);

                const response = await fetchData('/cart/delivery-types');
                setDeliveryTypes(response?.deliveryTypes ?? []);
            } catch (err) {
                setDeliveryTypesError(err.message);
            } finally {
                setDeliveryTypesLoading(false);
            }
        };

        loadDeliveryTypes();
    }, []);

    return { deliveryTypes, deliveryTypesLoading, deliveryTypesError };
};

export { useCart, useCartActions, usePayment, useDeliveryTypes };
