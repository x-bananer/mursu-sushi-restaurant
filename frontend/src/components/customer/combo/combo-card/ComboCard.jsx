import './combo-card.css';

import { useDrag } from 'react-dnd';

import Button from '../../../shared/button/Button';

export default function ComboCard({ ingredient, onAddIngredient, selectedIngredients = [] }) {
    const selectedCount = selectedIngredients.filter(
        (item) => Number(item?.id) === Number(ingredient?.id)
    ).length;

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'ingredient',
        item: ingredient,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [ingredient]);

    return (
        <article
            ref={dragRef}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="combo-card"
        >
            <span className="combo-card__title">{ingredient?.name}</span>
            <span className="combo-card__price">€{ingredient?.price}</span>
            <span className="combo-card__mobile-action">
                <Button onClick={() => onAddIngredient?.(ingredient)} variant="light" size="small">
                    + ADD
                </Button>
            </span>
            {selectedCount > 0 && (
                <span className="combo-card__badge">{selectedCount}</span>
            )}
        </article>
    );
}
