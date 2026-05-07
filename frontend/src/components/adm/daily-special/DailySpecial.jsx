import "./daily-special.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { dishes, loading, error } = useDishes();

  const week = getCurrentWeekDates();

  const { save } = useSaveDailySpecial();
  const { remove } = useDeleteDailySpecial();

  const { inputs, handleInputChange } = useForm(() => {}, {});

  const [savingDay, setSavingDay] = useState(null);
  const [toast, setToast] = useState(null);

  if (loading) {
    return <Loader text={t("admin.loading_dishes")} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!dishes.length) {
    return (
      <EmptyState
        title={t("admin.no_dishes_title")}
        description={t("admin.no_dishes_description")}
      />
    );
  }

  const handleSave = async (date) => {
    const dishId = inputs[date];

    if (!dishId) {
      setToast(t("admin.select_dish_first"));
      return;
    }

    try {
      setSavingDay(date);

      await save(dishId, date);

      setToast(t("admin.special_saved"));
    } catch (err) {
      setToast(err.message || t("admin.special_save_failed"));
    } finally {
      setSavingDay(null);
    }
  };

  const handleDelete = async (date) => {
    const dishId = inputs[date];

    if (!dishId) {
      setToast(t("admin.nothing_to_delete"));
      return;
    }

    try {
      await remove(dishId);

      setToast(t("admin.special_deleted"));
    } catch (err) {
      setToast(err.message || t("admin.special_delete_failed"));
    }
  };

  return (
    <section className="admin-main" id="page-weekly-special">
      <h2 className="admin-section-title">{t("admin.weekly_specials")}</h2>

      <div className="weekly-grid">
        {week.map((day) => (
          <div key={day.date} className="weekly-card">
            <h3 className="weekly-card__title">{day.label}</h3>

            <p className="weekly-card__date">{day.date}</p>

            <select
              name={day.date}
              value={inputs[day.date] || ""}
              onChange={handleInputChange}
            >
              <option value="">{t("admin.select_dish")}</option>
              {dishes.map((dish) => (
                <option key={dish.id} value={dish.id}>
                  {dish.name}
                </option>
              ))}
            </select>

            <div className="weekly-card__actions">
              <Button
                variant="accent"
                onClick={() => handleSave(day.date)}
                disabled={savingDay === day.date}
              >
                {savingDay === day.date ? t("admin.saving") : t("common.save")}
              </Button>

              <Button
                variant="danger"
                onClick={() => handleDelete(day.date)}
              >
                {t("common.delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </section>
  );
}
