import { createContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

import { useCart, useCartActions } from '../hooks/apiHooks/cart';

const CartProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState('');
    const { cart, setCart, loadLoading, loadError } = useCart(sessionId);
    const {
        addDishToCart: addDishToCartApi,
        addComboToCart: addComboToCartApi,
        cartActionLoading,
        cartActionError,
    } = useCartActions();

    useEffect(() => {
        let sessionId = localStorage.getItem('session_id');

        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem('session_id', sessionId);
        }

        setSessionId(sessionId);
    }, []);

    const addDishToCart = async (dishId, quantity) => {
        const updatedCart = await addDishToCartApi(sessionId, dishId, quantity);
        if (updatedCart) {
            setCart(updatedCart);
        }
        return updatedCart;
    };

    const addComboToCart = async (ingredients) => {
        const updatedCart = await addComboToCartApi(ingredients);
        if (updatedCart) {
            setCart(updatedCart);
        }
        return updatedCart;
    };

    const cartItemsCount = (cart?.items || []).reduce((sum, item) => {
        return sum + (item?.quantity || 0);
    }, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                loadLoading,
                loadError,
                cartActionLoading,
                cartActionError,
                sessionId,
                cartItemsCount,
                addDishToCart,
                addComboToCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider, CartContext };
