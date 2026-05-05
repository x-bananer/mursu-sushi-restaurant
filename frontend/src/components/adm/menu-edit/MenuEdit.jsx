import "./menu-edit.css";
import { useState } from "react";

import TableBase from "../../shared/table-base/tableBase";
import CategoryTabs from "../../shared/category-tabs/categoryTabs";
import CardBase from "../../shared/card-base/cardBase";
import Button from "../../shared/button/Button";
import InputField from "../../shared/input-field/InputField";

import { useFilters } from "../../../hooks/useFilters";

const ingredientTypeMap = {
  1: "Base",
  2: "Protein",
  3: "Topping",
};

export default function MenuEdit() {
  // ───────── MENU STATE ─────────
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  // ───────── INGREDIENT STATE ─────────
  const [ingredientCategory, setIngredientCategory] = useState("all");
  const [ingredientSearch, setIngredientSearch] = useState("");

  // ───────── FILTERED DATA ─────────
  const filteredMenu = useFilters({
  items: menuItems,
  activeCategory,
  search,
  sort,
  isAvailable: false,
  getCategoryId: (item) => item.category_id,
});

  const filteredIngredients = useFilters({
  items: ingredients,
  activeCategory: ingredientCategory,
  search: ingredientSearch,
  sort: "name",
  isAvailable: false,
  getCategoryId: (item) => item.ingredient_type_id,
});

  // ───────── CONFIG ─────────
  const menuCategories = [
    { id: 1, name: "Sashimi" },
    { id: 2, name: "Nigiri" },
    { id: 3, name: "Maki" },
    { id: 4, name: "Temaki" },
    { id: 5, name: "Small Plates" },
    { id: 6, name: "Sake" },
  ];

  const ingredientCategories = [
    { id: 1, name: "Bases" },
    { id: 2, name: "Proteins" },
    { id: 3, name: "Toppings" },
  ];

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price_asc", label: "Price ↑" },
    { value: "price_desc", label: "Price ↓" },
    { value: "name", label: "Name" },
  ];

  const columns = [
    { key: "name", label: "Ingredient" },
    { key: "type", label: "Type" },
    { key: "price", label: "Price" },
  ];

  return (
    <main className="menu-edit">
      <h2 className="menu-page__title">Menu Editor</h2>

      {/* ───────── INGREDIENTS ───────── */}
      <section className="menu-edit__section">

        {/* FILTERS */}
        <div className="menu-toolbar">
        <div className="menu-toolbar__group">
            {sortOptions.map((opt) => (
              <Button
                key={opt.value}
                size="small"
                variant={sort === opt.value ? "accent" : "dark"}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
        </div>
          <InputField
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
            placeholder="Search ingredients..."
          />
        </div>

          <CategoryTabs
            categories={ingredientCategories}
            active={ingredientCategory}
            onChange={setIngredientCategory}
          />

        {/* TABLE */}
<TableBase
  columns={columns}
  data={filteredIngredients}
  renderRow={(item) => (
    <div className="table__row" key={item.id}>
      <span>{item.name}</span>
      <span>{ingredientTypeMap[item.ingredient_type_id]}</span>
      <span>€{item.price.toFixed(2)}</span>

      <span className="table__actions">
  <span className={`badge badge--${item.is_available ? "ok" : "off"}`}>
    {item.is_available ? "Available" : "Disabled"}
  </span>

  <Button size="small" variant="accent" className="btn--xs">
    Edit
  </Button>

  <Button size="small" variant="danger" className="btn--xs">
    Delete
  </Button>
</span>
    </div>
  )}
/>
      </section>

      {/* ───────── MENU ───────── */}
      <section className="menu-edit__section">

        <div className="menu-toolbar">
          <div className="menu-toolbar__group">
            {sortOptions.map((opt) => (
              <Button
                key={opt.value}
                size="small"
                variant={sort === opt.value ? "accent" : "dark"}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          <InputField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
          />
        </div>

        <CategoryTabs
          categories={menuCategories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <section className="menu-grid menu-edit__grid">
          {filteredMenu.map((item, index) => (
            <CardBase
              key={item.id}
              title={item.name}
              price={item.price}
              description={item.description}
              variant={index % 2 === 0 ? "light" : "dark"}
              controllers={
                <>
                  <Button size="small" variant="accent">
                    Edit
                  </Button>

                  <Button
                    size="small"
                    variant={item.is_available ? "dark" : "gray"}
                  >
                    {item.is_available ? "Disable" : "Enable"}
                  </Button>
                </>
              }
            />
          ))}

          {filteredMenu.length === 0 && (
            <p className="menu-edit__empty">No dishes found</p>
          )}
        </section>
      </section>
    </main>
  );
}

const ingredients = [
  { id: 1, name: "Shari Rice", price: 5.0, is_available: true, ingredient_type_id: 1 },
  { id: 2, name: "Udon Silk", price: 9.0, is_available: true, ingredient_type_id: 1 },
  { id: 3, name: "Soba Earth", price: 8.0, is_available: true, ingredient_type_id: 1 },

  { id: 10, name: "Seared Wagyu", price: 34.0, is_available: true, ingredient_type_id: 2 },
  { id: 11, name: "Bluefin Toro", price: 28.0, is_available: true, ingredient_type_id: 2 },
  { id: 12, name: "Smoked Tofu", price: 12.0, is_available: true, ingredient_type_id: 2 },

  { id: 20, name: "Nori Dust", price: 4.0, is_available: true, ingredient_type_id: 3 },
  { id: 21, name: "Yuzu Zest", price: 6.0, is_available: true, ingredient_type_id: 3 },
  { id: 22, name: "Daikon Lace", price: 5.0, is_available: true, ingredient_type_id: 3 },
  { id: 23, name: "Shiso Leaf", price: 5.0, is_available: true, ingredient_type_id: 3 },
];

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
