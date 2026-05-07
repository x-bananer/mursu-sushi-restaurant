import "./daily-special.css";
import { useState } from "react";

import { getCurrentWeekDates } from "../../../utils/admHelpers";

import Button from "../../shared/button/Button";
import Loader from "../../shared/loader/Loader";
import ErrorState from "../../shared/error-state/errorState";
import EmptyState from "../../shared/empty-state/emptyState";
import Toast from "../../shared/toast/Toast";

import useForm from "../../../hooks/formHooks";
import { useDishes } from "../../../hooks/apiHooks/dish";
import {
  useSaveDailySpecial,
  useDeleteDailySpecial,
} from "../../../hooks/apiHooks/adm/dailySpecial";

export default function WeeklySpecial() {
  const { dishes, loading, error } = useDishes();

  const week = getCurrentWeekDates();

  const { save } = useSaveDailySpecial();
  const { remove } = useDeleteDailySpecial();

  const { inputs, handleInputChange } = useForm(() => {}, {});

  const [savingDay, setSavingDay] = useState(null);
  const [toast, setToast] = useState(null);

  /* ── STATES ───────────────────────────── */

  if (loading) {
    return <Loader text="Loading dishes..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!dishes.length) {
    return (
      <EmptyState
        title="No dishes available"
        description="Create dishes before assigning weekly specials."
      />
    );
  }

  /* ── HANDLERS ───────────────────────────── */

  const handleSave = async (date) => {
    const dishId = inputs[date];

    if (!dishId) {
      setToast("Please select a dish first");
      return;
    }

    try {
      setSavingDay(date);

      await save(dishId, date);

      setToast("Special saved");
    } catch (err) {
      setToast(err.message || "Failed to save");
    } finally {
      setSavingDay(null);
    }
  };

  const handleDelete = async (date) => {
    const dishId = inputs[date];

    if (!dishId) {
      setToast("Nothing to delete");
      return;
    }

    try {
      await remove(dishId);

      setToast("Special deleted");
    } catch (err) {
      setToast(err.message || "Failed to delete");
    }
  };

  /* ── UI ───────────────────────────── */

  return (
    <section className="admin-main" id="page-weekly-special">
      <h2 className="admin-section-title">Weekly Specials</h2>

      <div className="weekly-grid">
        {week.map((day) => (
          <div key={day.date} className="weekly-card">
            <h3 className="weekly-card__title">
              {day.label}
            </h3>

            <p className="weekly-card__date">
              {day.date}
            </p>

            {/* Dish selector */}
            <select
              name={day.date}
              value={inputs[day.date] || ""}
              onChange={handleInputChange}
            >
              <option value="">Select dish</option>
              {dishes.map((dish) => (
                <option key={dish.id} value={dish.id}>
                  {dish.name}
                </option>
              ))}
            </select>

            {/* Actions */}
            <div className="weekly-card__actions">
              <Button
                variant="accent"
                onClick={() => handleSave(day.date)}
                disabled={savingDay === day.date}
              >
                {savingDay === day.date ? "Saving..." : "Save"}
              </Button>

              <Button
                variant="danger"
                onClick={() => handleDelete(day.date)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Toast
        message={toast}
        onClose={() => setToast(null)}
      />
    </section>
  );
}
