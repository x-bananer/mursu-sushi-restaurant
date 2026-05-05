import { useState } from "react";
import { FiHeart } from "react-icons/fi";

import CardBase from "../../../shared/card-base/cardBase";
import Button from "../../../shared/button/Button";
import ButtonCounter from "../../../shared/button-counter/ButtonCounter";

export default function MenuDishCard({ item, index, cart, addDishToCart, removeCartItem }) {
	const [isPending, setIsPending] = useState(false);

	const isLightCard = index % 2 === 0;
	const cardVariant = isLightCard ? "light" : "dark";
	const heartButtonVariant = isLightCard ? "accent" : "light";
	const addButtonVariant = isLightCard ? "dark" : "light";
	const counterVariant = isLightCard ? "light" : "dark";

	const cartItem = (cart?.items || []).find((currentItem) => currentItem?.dish?.id === item.id) || null;
	const quantity = cartItem?.quantity || 0;

	const handleAddToCart = async () => {
		try {
			setIsPending(true);
			await addDishToCart(item.id, 1);
		} finally {
			setIsPending(false);
		}
	};

	const handleIncrease = async () => {
		const nextQuantity = (cartItem?.quantity || 0) + 1;
		try {
			setIsPending(true);
			await addDishToCart(item.id, nextQuantity);
		} finally {
			setIsPending(false);
		}
	};

	const handleDecrease = async () => {
		if (!cartItem) {
			return;
		}

		const nextQuantity = cartItem.quantity - 1;
		try {
			setIsPending(true);
			if (nextQuantity <= 0) {
				await removeCartItem(cartItem.id);
				return;
			}
			await addDishToCart(item.id, nextQuantity);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<CardBase
			title={item.name}
			price={item.price}
			description={item.description}
			tags={item.tags ?? []}
			variant={cardVariant}
			controllers={
				<>
					<Button size="small" variant={heartButtonVariant}>
						<FiHeart />
					</Button>

					{!quantity ? (
						<Button
							size="small"
							variant={addButtonVariant}
							onClick={handleAddToCart}
							disabled={isPending}
						>
							+ Add
						</Button>
					) : (
						<ButtonCounter
							value={quantity}
							variant={counterVariant}
							onMinus={isPending ? undefined : handleDecrease}
							onPlus={isPending ? undefined : handleIncrease}
						/>
					)}
				</>
			}
		/>
	);
}
