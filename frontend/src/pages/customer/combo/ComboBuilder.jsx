import "./combo-builder.css";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useComboIngredients } from '../../../hooks/apiHooks';

import ComboSection from '../../../components/customer/combo/combo-section/ComboSection';
import ComboSummary from '../../../components/customer/combo/combo-summary/ComboSummary';

export default function ComboBuilder() {
	const { ingredients, loading, error } = useComboIngredients();

	const base = ingredients.filter((i) => i.type?.type === 'base');
	const fillings = ingredients.filter((i) => i.type?.type === 'filling');
	const toppings = ingredients.filter((i) => i.type?.type === 'topping');

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
					<ComboSection title="Base" ingredients={base} />
					<ComboSection title="Fillings" ingredients={fillings} />
					<ComboSection title="Toppings" ingredients={toppings} />
				</div>
				<ComboSummary />
			</DndProvider>
		</div>
	);
}
