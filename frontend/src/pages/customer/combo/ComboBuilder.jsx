import "./combo-builder.css";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";

import { useComboIngredients } from '../../../hooks/apiHooks/combo';

import ComboSection from '../../../components/customer/combo/combo-section/ComboSection';
import ComboSummary from '../../../components/customer/combo/combo-summary/ComboSummary';
import Loader from '../../../components/shared/loader/Loader';
import ErrorState from '../../../components/shared/error-state/ErrorState';
import EmptyState from '../../../components/shared/empty-state/EmptyState';

export default function ComboBuilder() {
	const { ingredients, loading, error } = useComboIngredients();
	const [selectedIngredients, setSelectedIngredients] = useState([]);

	const base = ingredients.filter((i) => i.type?.type === 'base');
	const fillings = ingredients.filter((i) => i.type?.type === 'filling');
	const toppings = ingredients.filter((i) => i.type?.type === 'topping');

	const addIngredient = (ingredient) => {
		setSelectedIngredients((prev) => {
			const ingredientWithUid = { ...ingredient, uid: `${Date.now()}-${Math.random()}` };
			const type = ingredient?.type?.type;

			if (type === 'topping') {
				const notToppingIngredients = prev.filter((item) => item?.type?.type !== 'topping');
				return [...notToppingIngredients, ingredientWithUid];
			}

			if (type === 'filling') {
				const fillingIngredients = prev.filter((item) => item?.type?.type === 'filling');
				const notFillingIngredients = prev.filter((item) => item?.type?.type !== 'filling');
				const newFillingIngredients = [ingredientWithUid, ...fillingIngredients].slice(0, 3);
				return [...notFillingIngredients, ...newFillingIngredients];
			}

			if (type === 'base') {
				const notBaseIngredients = prev.filter((item) => item?.type?.type !== 'base');
				return [...notBaseIngredients, ingredientWithUid];
			}

			return [...prev, ingredientWithUid];
		});
	};

	const removeIngredient = (uid) => {
		setSelectedIngredients((prev) => prev.filter((item) => item?.uid !== uid));
	};

	const moveIngredient = (ingredient) => {
		setSelectedIngredients((prev) => {
			const fillings = prev.filter((i) => i.type.type === 'filling');
			const notFillings = prev.filter((i) => i.type.type !== 'filling');

			const updatedFillings = [...fillings];
			const [ingredientToMove] = updatedFillings.splice(ingredient.fromIndex, 1);
			updatedFillings.splice(ingredient.toIndex, 0, ingredientToMove);

			return [...notFillings, ...updatedFillings];
		});
	};

	const clearSelectedIngredients = () => {
		setSelectedIngredients([]);
	};

	if (loading) {
		return (
			<div className="combo-page combo-page--state">
				<Loader text="Loading ingredients..." isLight />
			</div>
		);
	}

	if (error) {
		return (
			<div className="combo-page combo-page--state">
				<ErrorState message={error} isLight />
			</div>
		);
	}

	if (ingredients.length === 0) {
		return (
			<div className="combo-page combo-page--state">
				<EmptyState
					title="No ingredients yet"
					description="Combo ingredients are temporarily unavailable."
					isLight
				/>
			</div>
		);
	}

	return (
		<div className="combo-page">
			<DndProvider backend={HTML5Backend}>
				<div className="combo-page__main">
					<div className="combo-page__hero">
						<h1 className="combo-page__title">Build a Set</h1>
						<p className="combo-page__subtitle">
							Choose your layers for a custom oshi sushi set: <br></br> one perfect topping, up to three fillings, and a perfectly paired base
						</p>
					</div>
					{toppings.length > 0 && (
						<ComboSection
							title="Toppings"
							ingredients={toppings}
							onAddIngredient={addIngredient}
							selectedIngredients={selectedIngredients}
						/>
					)}
					{fillings.length > 0 && (
						<ComboSection
							title="Fillings"
							ingredients={fillings}
							onAddIngredient={addIngredient}
							selectedIngredients={selectedIngredients}
						/>
					)}
					{base.length > 0 && (
						<ComboSection
							title="Base"
							ingredients={base}
							onAddIngredient={addIngredient}
							selectedIngredients={selectedIngredients}
						/>
					)}
				</div>
				<ComboSummary
					selectedIngredients={selectedIngredients}
					onAddIngredient={addIngredient}
					onRemoveIngredient={removeIngredient}
					onMoveIngredient={moveIngredient}
					onClearSelectedIngredients={clearSelectedIngredients}
				/>
			</DndProvider>
		</div>
	);
}
