import { useMemo } from "react";

export function useFilters({
  items = [],
  activeCategory = "all",
  search = "",
  sort = "default",
  isAvailable = false,

  // 👇 NEW: tells hook how to read category
  getCategoryId = (item) => item.category_id,
}) {
  return useMemo(() => {
    let result = [...items];

    // CATEGORY FILTER (generic now)
    if (activeCategory !== "all") {
      result = result.filter(
        (item) => String(getCategoryId(item)) === String(activeCategory)
      );
    }

    // AVAILABILITY
    if (isAvailable) {
      result = result.filter((item) => item.is_available);
    }

    // SEARCH
    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q)
      );
    }

    // SORT
    switch (sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [items, activeCategory, search, sort, isAvailable, getCategoryId]);
}
