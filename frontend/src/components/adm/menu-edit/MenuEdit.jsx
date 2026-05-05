import "./menu-edit.css";
import { useState } from "react";

import TableBase from "../../shared/table-base/tableBase";
import CategoryTabs from "../../shared/category-tabs/categoryTabs";
import CardBase from "../../shared/card-base/cardBase";
import Button from "../../shared/button/Button";
import InputField from "../../shared/input-field/InputField";
import Loader from "../../shared/loader/Loader";
import ErrorState from "../../shared/error-state/errorState";

import { useFilters } from "../../../hooks/useFilters";
import { useDishes, useDishCategories } from "../../../hooks/apiHooks/dish";

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

  const { dishes: menuItems, loading: dishesLoading, error: dishesError } = useDishes();
  const { categories: menuCategories, loading: categoriesLoading, error: categoriesError } = useDishCategories();
  const menuLoading = dishesLoading || categoriesLoading;
  const menuError = dishesError || categoriesError;

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
      <h2 className="menu-page__title menu-page__title--margin">Menu Editor</h2>

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

        {menuLoading && <Loader isLight text="Loading dishes..." />}
        {menuError && <ErrorState isLight message={menuError} />}

        {!menuLoading && !menuError && (
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
        )}
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
