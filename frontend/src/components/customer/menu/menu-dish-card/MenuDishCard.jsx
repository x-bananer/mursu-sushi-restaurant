import { useEffect, useMemo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router";

import CardBase from "../../../shared/card-base/cardBase";
import Button from "../../../shared/button/Button";
import ButtonCounter from "../../../shared/button-counter/ButtonCounter";
import { debounce } from "../../../../utils/debounce";

export default function MenuDishCard({
	item,
	index,
	cart,
	addDishToCart,
	removeCartItem,
	onToggleFavorite,
	isFavoritePending = false,
}) {
	const [isPending, setIsPending] = useState(false);
	const [visibleQuantity, setVisibleQuantity] = useState(0);
	const navigate = useNavigate();

	const isLightCard = index % 2 === 0;
	const isFavorite = item?.is_favorite;
	const cardVariant = isFavorite ? "accent" : isLightCard ? "light" : "dark";
	const heartButtonVariant = isFavorite
		? "accent"
		: isLightCard
			? "dark"
			: "light";
	const addButtonVariant = isLightCard ? "dark" : "light";
	const counterVariant = isLightCard ? "light" : "dark";

	const cartItem =
		(cart?.items || []).find(
			(currentItem) => currentItem.dish?.id === item?.id,
		) || null;
	const quantity = cartItem ? cartItem.quantity : 0;

	useEffect(() => {
		setVisibleQuantity(quantity);
	}, [quantity]);

	const debouncedAddToCart = useMemo(
		() =>
			debounce(async (newQuantity) => {
				try {
					setIsPending(true);
					await addDishToCart(item.id, newQuantity);
				} finally {
					setIsPending(false);
				}
			}, 300),
		[addDishToCart, item.id],
	);

	const debouncedToggleFavorite = useMemo(
		() =>
			debounce(() => {
				const token = localStorage.getItem("token");
				if (!token) {
					navigate("/auth");
					return;
				}
				onToggleFavorite();
			}, 300),
		[navigate, onToggleFavorite],
	);

	useEffect(() => {
		return () => {
			debouncedAddToCart.cancel();
			debouncedToggleFavorite.cancel();
		};
	}, [debouncedAddToCart, debouncedToggleFavorite]);

	const handleAddToCart = () => {
		setVisibleQuantity(1);
		debouncedAddToCart(1);
	};

	const handleIncrease = () => {
		const newQuantity = visibleQuantity + 1;
		setVisibleQuantity(newQuantity);
		debouncedAddToCart(newQuantity);
	};

	const handleDecrease = async () => {
		if (visibleQuantity <= 0) return;
		const newQuantity = visibleQuantity - 1;
		setVisibleQuantity(newQuantity);

		if (newQuantity <= 0) {
			try {
				setIsPending(true);
				await removeCartItem(cartItem.id);
			} finally {
				setIsPending(false);
			}
			return;
		}

		debouncedAddToCart(newQuantity);
	};

	const handleFavoriteClick = () => {
		debouncedToggleFavorite();
	};

	return (
		<CardBase
			title={item.name}
			price={item.price}
			description={item.description}
			tags={item.badges ?? []}
			variant={cardVariant}
			controllers={
				<>
					<Button
						size="small"
						variant={heartButtonVariant}
						onClick={handleFavoriteClick}
						disabled={isFavoritePending}
					>
						<FiHeart />
					</Button>

					{!visibleQuantity ? (
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
							value={visibleQuantity}
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
