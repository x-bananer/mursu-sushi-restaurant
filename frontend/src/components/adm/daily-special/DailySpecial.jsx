import "./daily-special.css";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

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
	useListDailySpecials,
} from "../../../hooks/apiHooks/adm/dailySpecial";

export default function WeeklySpecial() {
	const { t } = useTranslation();
	const {
		dishes,
		loading: dishesLoading,
		error: dishesError,
	} = useDishes();

	const {
		save,
		loading: saveLoading,
	} = useSaveDailySpecial();

	const {
		remove,
		loading: deleteLoading,
	} = useDeleteDailySpecial();

	const {
		list,
		loading: specialsLoading,
		error: specialsError,
	} = useListDailySpecials();

	const week = getCurrentWeekDates();

	const {
		inputs,
		setInputs,
		handleInputChange,
	} = useForm(() => {}, {});

	const [savingDay, setSavingDay] = useState(null);
	const [toast, setToast] = useState(null);

	/* ── LOAD EXISTING SPECIALS ───────────────────────────── */

	useEffect(() => {
		async function loadSpecials() {
			try {
				const specials = await list();

				const mapped = {};

				specials.forEach((special) => {
					// timezone-safe YYYY-MM-DD conversion
					const dateKey = new Date(special.valid_on)
						.toLocaleDateString("sv-SE");

					mapped[dateKey] = String(special.dish_id);
				});

				setInputs(mapped);

			} catch (err) {
				console.error("Failed to load specials:", err);
			}
		}

		loadSpecials();

		// run once on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ── STATES ───────────────────────────── */

	if (dishesLoading || specialsLoading) {
		return <Loader text={t("admin.loading_dishes")} />;
	}

	if (dishesError || specialsError) {
		return (
			<ErrorState
				message={dishesError || specialsError}
			/>
		);
	}

	if (!dishes.length) {
		return (
			<EmptyState
				title={t("admin.no_dishes_title")}
				description={t("admin.no_dishes_description")}
			/>
		);
	}

	/* ── HANDLERS ───────────────────────────── */

	const handleSave = async (date) => {
		const dishId = inputs[date];

		if (!dishId) {
			setToast(t("admin.select_dish_first"));
			return;
		}

		try {
			setSavingDay(date);

			await save(Number(dishId), date);

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
			setSavingDay(date);

			await remove(Number(dishId));

			setInputs((prev) => ({
				...prev,
				[date]: "",
			}));

			setToast(t("admin.special_deleted"));
		} catch (err) {
			setToast(err.message || t("admin.special_delete_failed"));
		} finally {
			setSavingDay(null);
		}
	};

	/* ── UI ───────────────────────────── */

	return (
		<section className="admin-main" id="page-weekly-special">
			<h2 className="admin-section-title">
				{t("admin.weekly_specials")}
			</h2>

			<div className="weekly-grid">
				{week.map((day) => (
					<div
						key={day.date}
						className="weekly-card"
					>
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
							disabled={savingDay === day.date}
						>
							<option value="">
								{t("admin.select_dish")}
							</option>

							{dishes.map((dish) => (
								<option
									key={dish.id}
									value={dish.id}
								>
									{dish.name}
								</option>
							))}
						</select>

						{/* Actions */}
						<div className="weekly-card__actions">
							<Button
								variant="accent"
								onClick={() => handleSave(day.date)}
								disabled={
									savingDay === day.date ||
									saveLoading
								}
							>
								{savingDay === day.date
									? t("admin.saving")
									: t("common.save")}
							</Button>

							<Button
								variant="danger"
								onClick={() => handleDelete(day.date)}
								disabled={
									savingDay === day.date ||
									deleteLoading
								}
							>
								{t("common.delete")}
							</Button>
						</div>
					</div>
				))}
			</div>

			{toast && (
				<Toast
					message={toast}
					onClose={() => setToast(null)}
				/>
			)}
		</section>
	);
}
