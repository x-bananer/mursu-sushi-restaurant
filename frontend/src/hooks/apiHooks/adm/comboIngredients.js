import { useEffect, useState } from "react";
import { fetchData } from "../../../utils/fetchData";

/* ───────── GET INGREDIENT TYPES ───────── */

export function useIngredientesCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchData("/dishes/combo/ingredients/types");
        setCategories(res?.ingredientTypes ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { categories, loading, error };
}

/* ───────── CREATE ───────── */

export function useCreateIngredient() {
  const create = async (payload) => {
    return fetchData("/adm/ingredients", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  return { create };
}

/* ───────── UPDATE ───────── */

export function useUpdateIngredient() {
  const update = async (id, payload) => {
    return fetchData(`/adm/ingredients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),

    });
  };

  return { update };
}

/* ───────── DELETE ───────── */

export function useDeleteIngredient() {
  const remove = async (id) => {
    return fetchData(`/adm/ingredients/${id}`, {
      method: "DELETE",
    });
  };

  return { remove };
}
