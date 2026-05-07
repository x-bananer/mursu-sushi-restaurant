import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import TableBase from "../../shared/table-base/tableBase";
import CategoryTabs from "../../shared/category-tabs/categoryTabs";
import Modal from "../../shared/modal/Modal";
import Toast from "../../shared/toast/Toast";
import Loader from "../../shared/loader/Loader";
import ErrorState from "../../shared/error-state/errorState";

import MenuItemForm from "./menuItemForm";
import ActionButtons from "./ActionButtons";
import MenuToolbar from "./MenuToolbar";

import { useFilters } from "../../../hooks/useFilters";

import { useComboIngredients } from "../../../hooks/apiHooks/combo";

import {
  useIngredientsCategories,
  useUpdateIngredient,
  useDeleteIngredient,
  useCreateIngredient,
} from "../../../hooks/apiHooks/adm/comboIngredients";

export default function IngredientsPanel() {
  const { t } = useTranslation();
  // ───────── UI STATE ─────────
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(false);

  // create | edit
  const [mode, setMode] = useState("create");

  // currently editing ingredient
  const [editing, setEditing] = useState(null);

  // local optimistic state
  const [localIngredients, setLocalIngredients] = useState([]);

  // filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  // ───────── API ─────────
  const {
    ingredients,
    loading,
    error,
  } = useComboIngredients({ onlyAvailable: false });

  const {
    categories,
  } = useIngredientsCategories();

  const { update } = useUpdateIngredient();
  const { remove } = useDeleteIngredient();
  const { create } = useCreateIngredient();

  // ───────── SYNC SERVER → LOCAL ─────────
  useEffect(() => {
    setLocalIngredients(ingredients || []);
  }, [ingredients]);

  // ───────── CATEGORY MAP ─────────
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  // ───────── FILTERS ─────────
  const filtered = useFilters({
    items: localIngredients,
    activeCategory: category,
    search,
    sort,
    isAvailable: false,
    getCategoryId: (item) => item.ingredient_type_id,
  });

  // ───────── CONFIG ─────────
  const sortOptions = [
    { value: "default", label: t("menu.sort_default") },
    { value: "price_asc", label: t("menu.sort_price_asc") },
    { value: "price_desc", label: t("menu.sort_price_desc") },
    { value: "name", label: t("menu.sort_name") },
  ];

  const columns = [
    { key: "name", label: t("admin.ingredient") },
    { key: "price", label: t("admin.price") },
    { key: "category", label: t("admin.type") },
  ];

  // ───────── EMPTY FORM ─────────
  const emptyIngredient = {
    id: null,
    name: "",
    price: "",
    ingredient_type_id: "",
    is_available: true,
  };

  // ───────── ACTIONS ─────────
  const openCreate = () => {
    setMode("create");
    setEditing(emptyIngredient);
    setModal(true);
  };

  const openEdit = (item) => {
    setMode("edit");
    setEditing(item);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditing(null);
  };

  // ───────── CREATE ─────────
  const handleSubmit = async (form) => {
    if (mode === "edit" && editing?.id != null) {
      // optimistic update
      const previous = [...localIngredients];

      setLocalIngredients((prev) =>
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
        setToast(t("admin.ingredient_updated"));
        closeModal();
      } catch (err) {
        setLocalIngredients(previous);
        setToast(err.message || t("admin.generic_update_error"));
      }
    } else {
      // optimistic create
      const tempIngredient = {
        id: crypto.randomUUID(),
        ...form,
      };

      setLocalIngredients((prev) => [
        tempIngredient,
        ...prev,
      ]);

      try {
        const created = await create(form);

        setLocalIngredients((prev) =>
          prev.map((item) =>
            item.id === tempIngredient.id
              ? created
              : item
          )
        );

        setToast(t("admin.ingredient_created"));
        closeModal();
      } catch (err) {
        setLocalIngredients((prev) =>
          prev.filter(
            (item) => item.id !== tempIngredient.id
          )
        );

        setToast(err.message || t("admin.generic_update_error"));
      }
    }
  };

  // ───────── DELETE ─────────
  const handleDelete = async (id) => {
    const previous = [...localIngredients];

    // optimistic delete
    setLocalIngredients((prev) =>
      prev.filter((item) => item.id !== id)
    );

    try {
      await remove(id);
      setToast(t("admin.ingredient_deleted"));
    } catch (err) {
      setLocalIngredients(previous);
      setToast(err.message || t("admin.generic_update_error"));
    }
  };

  // ───────── TOGGLE ─────────
  const handleToggle = async (item) => {
    const previous = [...localIngredients];

    // optimistic toggle
    setLocalIngredients((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              is_available: !i.is_available,
            }
          : i
      )
    );

    try {
      await update(item.id, {
        is_available: !item.is_available,
      });

      setToast(t("admin.ingredient_updated"));
    } catch (err) {
      setLocalIngredients(previous);
      setToast(err.message || t("admin.generic_update_error"));
    }
  };

  return (
    <section className="menu-edit__section">
      {/* ───────── CATEGORY FILTER ───────── */}
      <CategoryTabs
        categories={categories}
        active={category}
        onChange={setCategory}
      />

      {/* ───────── TOOLBAR ───────── */}
      <MenuToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        sortOptions={sortOptions}
        onCreate={openCreate}
        createLabel={t("admin.add_ingredient")}
        placeholder={t("admin.menu_search_ingredients")}
      />

      {/* ───────── STATES ───────── */}
      {loading && (
        <Loader
          isLight
          text={t("combo.loading")}
        />
      )}

      {error && (
        <ErrorState
          isLight
          message={error}
        />
      )}

      {/* ───────── TABLE ───────── */}
      {!loading && !error && (
        <TableBase
          columns={columns}
          data={filtered}
          renderRow={(item) => (
            <div
              className="table__row"
              key={item.id}
            >
              {/* NAME */}
              <span>{item.name}</span>

              {/* PRICE */}
              <span>
                €{Number(item.price).toFixed(2)}
              </span>

              {/* CATEGORY */}
              <span>
                <span className="badge badge--neutral">
                  {categoryMap[item.ingredient_type_id] || t("common.unknown")}
                </span>
              </span>

              {/* ACTIONS */}
              <ActionButtons
                isActive={item.is_available}
                onEdit={() => openEdit(item)}
                onDelete={() => handleDelete(item.id)}
                onToggle={() => handleToggle(item)}
              />
            </div>
          )}
        />
      )}

      {/* ───────── MODAL ───────── */}
      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={
          mode === "edit"
            ? t("admin.edit_ingredient")
            : t("admin.create_ingredient")
        }
      >
        <MenuItemForm
          type="ingredient"
          initialData={editing || emptyIngredient}
          categories={categories}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* ───────── TOAST ───────── */}
      <Toast
        message={toast}
        onClose={() => setToast(null)}
      />
    </section>
  );
}
