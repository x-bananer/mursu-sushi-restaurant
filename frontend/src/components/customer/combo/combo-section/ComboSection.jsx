import './combo-section.css';

import ComboCard from '../combo-card/ComboCard';

export default function ComboSection({ title = "", ingredients = [], onAddIngredient, selectedIngredients = [] }) {
    return (
        <section className="combo-section">
            <div className="combo-section__head">
                <h2 className="combo-section__title">
                    {title}
                </h2>
            </div>
            <div className="combo-section__grid">
                {ingredients.map((ingredient) => {
                    return (
                        <ComboCard
                            key={ingredient.id}
                            ingredient={ingredient}
                            onAddIngredient={onAddIngredient}
                            selectedIngredients={selectedIngredients}
                        />
                    );
                })}
            </div>
        </section>
    )
}
