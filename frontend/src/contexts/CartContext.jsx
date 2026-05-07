import { createContext, useEffect, useState } from "react";

const CartContext = createContext(null);

import { useCart, useCartActions } from "../hooks/apiHooks/cart";

const CartProvider = ({ children }) => {
	const [sessionId, setSessionId] = useState("");
	const { cart, setCart, loadLoading, loadError } = useCart(sessionId);
	const {
		addDishToCart: addDishToCartApi,
		addComboToCart: addComboToCartApi,
		updateCartItems,
		cartActionLoading,
		cartActionError,
	} = useCartActions();

	useEffect(() => {
		let sessionId = localStorage.getItem("session_id");

		if (!sessionId) {
			sessionId = crypto.randomUUID();
			localStorage.setItem("session_id", sessionId);
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

	const removeCartItem = async (itemId) => {
		const currentItems = cart?.items || [];
		const updateItems = currentItems
			.filter((item) => item.id !== itemId)
			.map((item) => ({
				id: item.id,
				dish_id: item?.dish?.id ?? null,
				quantity: item.quantity,
				item_type_id: item?.type?.id,
				ingredients: Array.isArray(item.ingredients)
					? item.ingredients.map((ingredient) => ({
							ingredient_id: ingredient.ingredient.id,
							quantity: ingredient.quantity,
							position: ingredient.position,
						}))
					: null,
			}));

		const updatedCart = await updateCartItems(updateItems);

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
				removeCartItem,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export { CartProvider, CartContext };
