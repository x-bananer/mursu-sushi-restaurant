import "./combo-builder.css";

import ComboSection from '../../../components/customer/combo/combo-section/ComboSection';
import ComboSummary from '../../../components/customer/combo/combo-summary/ComboSummary';

export default function ComboBuilder() {
	return (
		<div className="combo-page">
			<div className="combo-page__main">
				<div className="combo-page__hero">
					<h1 className="combo-page__title">Build a Set</h1>
					<p className="combo-page__subtitle">
						Select the layers for your custom oshi sushi set
					</p>
				</div>
				<ComboSection title="Base" />
				<ComboSection title="Fillings" />
				<ComboSection title="Toppings" />
			</div>
			<ComboSummary />
		</div>
	);
}
