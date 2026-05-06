import "./menu.css";
import { useMemo, useState } from "react";

import CategoryTabs from "../../../components/shared/category-tabs/categoryTabs";
import SpecialCard from "../../../components/customer/menu/special-card/specialCard";
import MenuDishCard from "../../../components/customer/menu/menu-dish-card/MenuDishCard";
import Button from "../../../components/shared/button/Button";
import InputField from "../../../components/shared/input-field/InputField";
import Loader from "../../../components/shared/loader/Loader";
import ErrorState from "../../../components/shared/error-state/errorState";
import EmptyState from "../../../components/shared/empty-state/emptyState";
import Toast from "../../../components/shared/toast/Toast";

import { useFilters } from "../../../hooks/useFilters";
import { useDishes, useDishCategories, useDailySpecial, useDishFavorites } from "../../../hooks/apiHooks/dish";
import { useCartContext } from "../../../hooks/contextHooks/cart";

export default function Menu() {
	const [activeCategory, setActiveCategory] = useState("all");
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("default");
	const [favoriteToast, setFavoriteToast] = useState("");

	const { dishes, loading: dishesLoading, error: dishesError } = useDishes();
	const { categories, loading: categoriesLoading, error: categoriesError } = useDishCategories();
	const { specialDish, loading: specialLoading, error: specialError } = useDailySpecial();
	const { favoriteDishIds, toggleFavorite, pendingDishIds, loading: favoritesLoading } = useDishFavorites();
	const { cart, addDishToCart, removeCartItem } = useCartContext();

	const loading = dishesLoading || categoriesLoading || specialLoading || favoritesLoading;
	const error = dishesError || categoriesError || specialError;

	const dishesWithFavorite = useMemo(() => {
		return dishes.map((dish) => ({
			...dish,
			is_favorite: favoriteDishIds.includes(dish.id),
		}));
	}, [dishes, favoriteDishIds]);

	const filteredItems = useFilters({
		items: dishesWithFavorite,
		activeCategory,
		search,
		sort,
	});

	const availableItems = filteredItems.filter((item) => item.is_available);
	const unavailableItems = filteredItems.filter((item) => !item.is_available);

	const sortOptions = [
		{ value: "default", label: "Default" },
		{ value: "price_asc", label: "Price ↑" },
		{ value: "price_desc", label: "Price ↓" },
		{ value: "name", label: "Name" },
	];

	return (
		<div className="menu-page">
			<section className="menu-page__hero">
				<div className="menu-page__hero-main">
					<h1 className="menu-page__title">Menu</h1>
					<p className="menu-page__subtitle">
						Browse the menu, choose your favorites, and add them to cart.
					</p>
				</div>

				<aside className="menu-page__hero-side">
					<SpecialCard
						item={{
							title: specialDish?.name ?? "Daily Special",
							description: specialDish?.description ?? "No special dish today.",
						}}
					/>
				</aside>
			</section>

			<CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />

			<div className="menu-toolbar menu-toolbar--long">
				<div className="menu-toolbar__search">
					<InputField
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search dishes..."
					/>
				</div>

				<div className="menu-toolbar__group">
					{sortOptions.map((opt) => (
						<Button
							key={opt.value}
							size="small"
							variant={sort === opt.value ? "accent" : "dark"}
							onClick={() => setSort(opt.value)}
							className="menu-toolbar__btn"
						>
							{opt.label}
						</Button>
					))}
				</div>
			</div>

			{loading && <Loader isLight text="Loading menu..." />}
			{error && <ErrorState isLight message={error} onRetry={() => window.location.reload()} />}
			{!loading && !error && filteredItems.length === 0 && (
				<EmptyState
					isLight
					title="No dishes found"
					description="Try another category or adjust your search."
				/>
			)}

			{!loading && !error && filteredItems.length > 0 && (
				<>
					{availableItems.length > 0 && (
						<section className="menu-section">
							<h2 className="menu-section__title">Today’s Menu</h2>
							<section className="menu-grid">
								{availableItems.map((item, index) => (
									<MenuDishCard
										key={item.id}
										item={item}
										index={index}
										cart={cart}
										addDishToCart={addDishToCart}
										removeCartItem={removeCartItem}
										onToggleFavorite={async () => {
											const result = await toggleFavorite(item.id);
											if (result?.message) {
												setFavoriteToast(result.message);
											}
										}}
										isFavoritePending={pendingDishIds.includes(item.id)}
									/>
								))}
							</section>
						</section>
					)}

					{unavailableItems.length > 0 && (
						<section className="menu-section">
							<h2 className="menu-section__title">Other Dishes</h2>
							<section className="menu-grid menu-grid--unavailable">
								{unavailableItems.map((item, index) => (
									<MenuDishCard
										key={item.id}
										item={item}
										index={index}
										cart={cart}
										addDishToCart={addDishToCart}
										removeCartItem={removeCartItem}
										onToggleFavorite={() => {}}
										isFavoritePending
									/>
								))}
							</section>
						</section>
					)}
				</>
			)}
			<Toast message={favoriteToast} duration={3000} onClose={() => setFavoriteToast("")} />
		</div>
	);
}
