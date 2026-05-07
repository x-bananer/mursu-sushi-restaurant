import { useState } from "react";

import CardBase from "../../shared/card-base/cardBase";
import CategoryTabs from "../../shared/category-tabs/categoryTabs";
import Loader from "../../shared/loader/Loader";
import ErrorState from "../../shared/error-state/errorState";
import Toast from "../../shared/toast/Toast";
import Modal from "../../shared/modal/Modal";

import MenuToolbar from "./menuToolbar";
import MenuItemForm from "./menuItemForm";
import ActionButtons from "./ActionButtons";

import { useFilters } from "../../../hooks/useFilters";

import {
  useDishes,
  useDishCategories,
} from "../../../hooks/apiHooks/dish";

import {
  useUpdateDish,
  useDeleteDish,
  useCreateDish,
} from "../../../hooks/apiHooks/adm/dish";

export default function DishesPanel() {
  // ───────── FILTERS ─────────
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  // ───────── MODAL ─────────
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mode, setMode] = useState("create");

  // ───────── FEEDBACK ─────────
  const [toast, setToast] = useState(null);

  // ───────── API ─────────
  const {
    dishes,
    loading: dishesLoading,
    error: dishesError,
  } = useDishes();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useDishCategories();

  const { update } = useUpdateDish();
  const { remove } = useDeleteDish();
  const { create } = useCreateDish();

  // ───────── STATES ─────────
  const loading = dishesLoading || categoriesLoading;
  const error = dishesError || categoriesError;

  // ───────── FILTERED DATA ─────────
  const filteredDishes = useFilters({
    items: dishes,
    activeCategory,
    search,
    sort,
    isAvailable: false,
    getCategoryId: (item) => item.category_id,
  });

  // ───────── CONFIG ─────────
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price_asc", label: "Price ↑" },
    { value: "price_desc", label: "Price ↓" },
    { value: "name", label: "Name" },
  ];

  // ───────── DEFAULT OBJECT ─────────
  const emptyDish = {
    id: null,
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_available: true,
  };

  // ───────── ACTIONS ─────────
  const openCreate = () => {
    setEditing(emptyDish);
    setMode("create");
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setMode("edit");
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditing(null);
  };

  const handleSubmit = async (form) => {
    try {
      if (mode === "edit" && editing?.id != null) {
        await update(editing.id, form);
        setToast("Dish updated");
      } else {
        await create(form);
        setToast("Dish created");
      }

      closeModal();
    } catch (err) {
      setToast(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      setToast("Dish deleted");
    } catch (err) {
      setToast(err.message);
    }
  };

  const handleToggle = async (item) => {
    try {
      await update(item.id, {
        is_available: !item.is_available,
      });

      setToast("Dish updated");
    } catch (err) {
      setToast(err.message);
    }
  };

  return (
    <section className="menu-edit__section">

      {/* FILTERS */}
      <CategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <MenuToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        sortOptions={sortOptions}
        onCreate={openCreate}
        createLabel="Add Dish"
      />

      {/* STATES */}
      {loading && (
        <Loader
          isLight
          text="Loading dishes..."
        />
      )}

      {error && (
        <ErrorState
          isLight
          message={error}
        />
      )}

      {/* GRID */}
      {!loading && !error && (
        <section className="menu-grid menu-edit__grid">
          {filteredDishes.map((item, index) => (
            <CardBase
              key={item.id}
              title={item.name}
              price={item.price}
              description={item.description}
              variant={index % 2 === 0 ? "light" : "dark"}
              controllers={
                <ActionButtons
                  isActive={item.is_available}
                  onEdit={() => openEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                  onToggle={() => handleToggle(item)}
                />
              }
            />
          ))}

          {filteredDishes.length === 0 && (
            <p className="menu-edit__empty">
              No dishes found
            </p>
          )}
        </section>
      )}

      {/* MODAL */}
      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={mode === "edit" ? "Edit Dish" : "Create Dish"}
      >
        <MenuItemForm
          type="dish"
          initialData={editing || emptyDish}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* TOAST */}
      <Toast
        message={toast}
        onClose={() => setToast(null)}
      />
    </section>
  );
}
