import "./menu.css";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";

import CategoryTabs from "../../../components/shared/category-tabs/categoryTabs";
import CardBase from "../../../components/shared/card-base/cardBase";
import SpecialCard from "../../../components/customer/menu/special-card/specialCard";
import Button from "../../../components/shared/button/Button";
import InputField from "../../../components/shared/input-field/InputField"
import ButtonCounter from "../../../components/shared/button-counter/ButtonCounter";

import { useFilters } from "../../../hooks/useFilters";

export default function Menu() {
	const [activeCategory, setActiveCategory] = useState("all");
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("default");
	const filteredItems = useFilters({
  	  items: menuItems,
  	  activeCategory,
      search,
  	  sort,
	});

	// cart state (id -> quantity)
	const [cart, setCart] = useState({});
	const categories = [
  	  { id: 1, name: "Sashimi" },
	    { id: 2, name: "Nigiri" },
  	  { id: 3, name: "Maki" },
      { id: 4, name: "Temaki" },
      { id: 5, name: "Small Plates" },
  	  { id: 6, name: "Sake" },
	];

	const sortOptions = [
  	  { value: "default", label: "Default" },
  	  { value: "price_asc", label: "Price ↑" },
	    { value: "price_desc", label: "Price ↓" },
  	  { value: "name", label: "Name" },
	];

	// handlers
	const addToCart = (id) => {
		setCart((prev) => ({
			...prev,
			[id]: 1,
		}));
	};

	const increase = (id) => {
		setCart((prev) => ({
			...prev,
			[id]: prev[id] + 1,
		}));
	};

	const decrease = (id) => {
		setCart((prev) => {
			const newValue = prev[id] - 1;

			// remove item if 0
			if (newValue <= 0) {
				const updated = { ...prev };
				delete updated[id];
				return updated;
			}

			return {
				...prev,
				[id]: newValue,
			};
		});
	};

	return (
		<div className="menu-page">
			{/* HERO */}
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
							title: "Sake Sashimi",
							description: "8 slices salmon sashimi with fresh wasabi and pickled ginger. Served with...",
						}}
					/>
				</aside>
			</section>

			{/* TABS */}
			<CategoryTabs
				categories={categories}
				active={activeCategory}
				onChange={setActiveCategory}
			/>
			<div className="menu-toolbar">
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

      <div className="menu-toolbar__search">
        <InputField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dishes..."
        />
      </div>
      </div>

			{/* GRID */}
			<section className="menu-grid">
				{filteredItems.map((item, index) => {
					const quantity = cart[item.id];

					return (
						<CardBase
							key={item?.id}
							title={item.name}
							price={item?.price}
							description={item?.description}
							tags={item?.tags ?? []}
							variant={index % 2 === 0 ? "light" : "dark"}

							controllers={
								<>
									<Button size="small" variant="accent">
  										<FiHeart/>
									</Button>

									{!quantity ? (
										<Button
  											size="small"
  											variant="dark"
  											onClick={() => addToCart(item.id)}
										>
  											+ Add
										</Button>
									) : (
										<ButtonCounter
  											value={quantity}
  											onMinus={() => decrease(item.id)}
  											onPlus={() => increase(item.id)}
										/>
									)}
								</>
							}
						/>
					);
     		})}
			</section>
		</div>
	);
}

const menuItems = [
  // SASHIMI
  {
    id: 1,
    name: "Sake Sashimi",
    description:
      "8 slices salmon sashimi with wasabi, ginger, soy sauce and seaweed salad.",
    price: 24.0,
    is_available: true,
    category_id: 1,
  },
  {
    id: 2,
    name: "Maguro Sashimi",
    description:
      "6 slices tuna sashimi with pickled ginger and soy sauce.",
    price: 24.0,
    is_available: true,
    category_id: 1,
  },
  {
    id: 3,
    name: "Hamachi Sashimi",
    description:
      "Yellowtail sashimi with ponzu and citrus zest.",
    price: 26.0,
    is_available: true,
    category_id: 1,
  },

  // NIGIRI
  {
    id: 4,
    name: "Salmon Nigiri",
    description:
      "Fresh salmon over pressed sushi rice.",
    price: 18.0,
    is_available: true,
    category_id: 2,
  },
  {
    id: 5,
    name: "Tuna Nigiri",
    description:
      "Lean tuna nigiri with wasabi accent.",
    price: 19.0,
    is_available: true,
    category_id: 2,
  },
  {
    id: 6,
    name: "Ebi Nigiri",
    description:
      "Sweet shrimp nigiri with light soy glaze.",
    price: 17.0,
    is_available: true,
    category_id: 2,
  },

  // MAKI
  {
    id: 7,
    name: "Spicy Tuna Roll",
    description:
      "Tuna, chili mayo, cucumber and sesame.",
    price: 16.0,
    is_available: true,
    category_id: 3,
  },
  {
    id: 8,
    name: "California Roll",
    description:
      "Crab, avocado, cucumber and tobiko.",
    price: 15.0,
    is_available: true,
    category_id: 3,
  },
  {
    id: 9,
    name: "Avocado Maki",
    description:
      "Fresh avocado roll with sesame.",
    price: 12.0,
    is_available: true,
    category_id: 3,
  },

  // TEMAKI
  {
    id: 10,
    name: "Salmon Temaki",
    description:
      "Hand roll with salmon, rice and nori.",
    price: 14.0,
    is_available: true,
    category_id: 4,
  },
  {
    id: 11,
    name: "Spicy Tuna Temaki",
    description:
      "Cone hand roll with spicy tuna mix.",
    price: 15.0,
    is_available: true,
    category_id: 4,
  },

  // SMALL PLATES
  {
    id: 12,
    name: "Edamame",
    description:
      "Sea salt edamame beans.",
    price: 6.0,
    is_available: true,
    category_id: 5,
  },
  {
    id: 13,
    name: "Miso Soup",
    description:
      "Traditional miso with tofu and seaweed.",
    price: 5.0,
    is_available: true,
    category_id: 5,
  },
  {
    id: 14,
    name: "Gyoza",
    description:
      "Pan-fried pork dumplings with dipping sauce.",
    price: 9.0,
    is_available: true,
    category_id: 5,
  },

  // SAKE
  {
    id: 15,
    name: "Junmai Sake",
    description:
      "Smooth rice sake with clean finish.",
    price: 10.0,
    is_available: true,
    category_id: 6,
  },
  {
    id: 16,
    name: "Nigori Sake",
    description:
      "Unfiltered sweet sake with creamy texture.",
    price: 11.0,
    is_available: true,
    category_id: 6,
  },
];
