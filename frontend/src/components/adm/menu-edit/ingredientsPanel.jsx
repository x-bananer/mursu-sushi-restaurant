import { useEffect, useMemo, useState } from "react";

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
    { value: "default", label: "Default" },
    { value: "price_asc", label: "Price ↑" },
    { value: "price_desc", label: "Price ↓" },
    { value: "name", label: "Name" },
  ];

  const columns = [
    { key: "name", label: "Ingredient" },
    { key: "price", label: "Price" },
    { key: "category", label: "Category" },
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
        setToast("Ingredient updated");
        closeModal();
      } catch (err) {
        setLocalIngredients(previous);
        setToast(err.message || "Something went wrong");
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

        setToast("Ingredient created");
        closeModal();
      } catch (err) {
        setLocalIngredients((prev) =>
          prev.filter(
            (item) => item.id !== tempIngredient.id
          )
        );

        setToast(err.message || "Something went wrong");
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
      setToast("Ingredient deleted");
    } catch (err) {
      setLocalIngredients(previous);
      setToast(err.message || "Something went wrong");
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

      setToast("Ingredient updated");
    } catch (err) {
      setLocalIngredients(previous);
      setToast(err.message || "Something went wrong");
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
        createLabel="Add Ingredient"
        placeholder="Search ingredients..."
      />

      {/* ───────── STATES ───────── */}
      {loading && (
        <Loader
          isLight
          text="Loading ingredients..."
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
                  {categoryMap[item.ingredient_type_id] || "Unknown"}
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
            ? "Edit Ingredient"
            : "Create Ingredient"
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
