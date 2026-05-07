import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  // ───────── LOCAL STATE (OPTIMISTIC) ─────────
  const [localDishes, setLocalDishes] = useState([]);

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

  // ───────── SYNC SERVER → LOCAL ─────────
  useEffect(() => {
    setLocalDishes(dishes || []);
  }, [dishes]);

  // ───────── STATES ─────────
  const loading = dishesLoading || categoriesLoading;
  const error = dishesError || categoriesError;

  // ───────── FILTERED DATA ─────────
  const filteredDishes = useFilters({
    items: localDishes,
    activeCategory,
    search,
    sort,
    isAvailable: false,
    getCategoryId: (item) => item.category_id,
  });

  // ───────── CONFIG ─────────
  const sortOptions = [
    { value: "default", label: t("menu.sort_default") },
    { value: "price_asc", label: t("menu.sort_price_asc") },
    { value: "price_desc", label: t("menu.sort_price_desc") },
    { value: "name", label: t("menu.sort_name") },
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

  // ───────── CREATE / UPDATE ─────────
  const handleSubmit = async (form) => {
    // ───── EDIT ─────
    if (mode === "edit" && editing?.id != null) {
      const previous = [...localDishes];

      // optimistic update
      setLocalDishes((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );

      try {
        await update(editing.id, form);

        setToast(t("admin.dish_updated"));
        closeModal();
      } catch (err) {
        setLocalDishes(previous);
        setToast(err.message || t("admin.generic_update_error"));
      }
    }

    // ───── CREATE ─────
    else {
      const tempDish = {
        id: crypto.randomUUID(),
        ...form,
      };

      // optimistic create
      setLocalDishes((prev) => [
        tempDish,
        ...prev,
      ]);

      try {
        const created = await create(form);

        setLocalDishes((prev) =>
          prev.map((item) =>
            item.id === tempDish.id
              ? created
              : item
          )
        );

        setToast(t("admin.dish_created"));
        closeModal();
      } catch (err) {
        setLocalDishes((prev) =>
          prev.filter(
            (item) => item.id !== tempDish.id
          )
        );

        setToast(err.message || t("admin.generic_update_error"));
      }
    }
  };

  // ───────── DELETE ─────────
  const handleDelete = async (id) => {
    const previous = [...localDishes];

    // optimistic delete
    setLocalDishes((prev) =>
      prev.filter((item) => item.id !== id)
    );

    try {
      await remove(id);

      setToast(t("admin.dish_deleted"));
    } catch (err) {
      setLocalDishes(previous);
      setToast(err.message || t("admin.generic_update_error"));
    }
  };

  // ───────── TOGGLE ─────────
  const handleToggle = async (item) => {
    const previous = [...localDishes];

    // optimistic toggle
    setLocalDishes((prev) =>
      prev.map((dish) =>
        dish.id === item.id
          ? {
              ...dish,
              is_available: !dish.is_available,
            }
          : dish
      )
    );

    try {
      await update(item.id, {
        is_available: !item.is_available,
      });

      setToast(t("admin.dish_updated"));
    } catch (err) {
      setLocalDishes(previous);
      setToast(err.message || t("admin.generic_update_error"));
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
        createLabel={t("admin.add_dish")}
      />

      {/* STATES */}
      {loading && (
        <Loader
          isLight
          text={t("admin.loading_dishes")}
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
              {t("admin.menu_no_dishes")}
            </p>
          )}
        </section>
      )}

      {/* MODAL */}
      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={
          mode === "edit"
            ? t("admin.edit_dish")
            : t("admin.create_dish")
        }
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
