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

export { useCart, useCartActions };
