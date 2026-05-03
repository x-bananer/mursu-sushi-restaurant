import './combo-summary.css';

import Button from '../../../shared/button/Button';
import Toast from '../../../shared/toast/Toast';
import ComboLayer from '../combo-layer/ComboLayer';
import ErrorState from '../../../shared/error-state/ErrorState';

import { useDrop } from 'react-dnd';
import { useState } from 'react';
import { useComboPreview, useCreateCombo } from '../../../../hooks/apiHooks/combo';

export default function ComboSummary({
    selectedIngredients = [],
    onAddIngredient,
    onRemoveIngredient,
    onMoveIngredient,
    onClearSelectedIngredients,
}) {
    const [successMessage, setSuccessMessage] = useState('');

    const [{ isOver, canDrop }, ingredientDropRef] = useDrop(
        () => ({
            accept: 'ingredient',
            drop: (ingredient) => {
                onAddIngredient?.(ingredient);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        []
    );

    const groupedLayers = {
        base: [],
        filling: [],
        topping: [],
    };

    selectedIngredients.forEach((ingredient) => {
        const type = ingredient?.type?.type;
        if (type === 'base') groupedLayers.base.push(ingredient);
        if (type === 'filling') groupedLayers.filling.push(ingredient);
        if (type === 'topping') groupedLayers.topping.push(ingredient);
    });

    const orderedForBackend = [
        ...groupedLayers.base,
        ...groupedLayers.filling,
        ...groupedLayers.topping,
    ];

    const ingredientsForPreview = orderedForBackend.map((item, index) => ({
        ingredient_id: item.id,
        quantity: 1,
        position: index + 1,
    }));

    const { combo, error: comboError } = useComboPreview(ingredientsForPreview);

    const isActive = isOver && canDrop;

    const { createCombo, loading: createLoading, error: createError } = useCreateCombo();

    const handleAddToCart = async () => {
        try {
            const sessionId = localStorage.getItem('session_id');
            await createCombo(ingredientsForPreview, sessionId);
            onClearSelectedIngredients();
            setSuccessMessage('Your oshi-sushi set has been successfully added to the cart!');
        } catch {
            // Error state comes from useCreateCombo hook.
        }
    };

    return (
        <aside className="combo-summary">
            <div className="combo-summary__container">
                <h2 className="combo-summary__title">Your Set</h2>
                <div
                    ref={(node) => {
                        ingredientDropRef(node);
                    }}
                    className={`combo-summary__stack ${canDrop ? 'combo-summary__stack--can-drop' : ''} ${isActive ? 'combo-summary__stack--active' : ''}`}
                >
                    {groupedLayers.topping.map((ingredient, index) => (
                        <ComboLayer key={`topping-${ingredient.id}-${index}`} ingredient={ingredient} index={index} isFixed moveIngredient={onMoveIngredient} removeIngredient={onRemoveIngredient} />
                    ))}
                    {groupedLayers.filling.map((ingredient, index) => (
                        <ComboLayer key={`filling-${ingredient.id}-${index}`} ingredient={ingredient} index={index} moveIngredient={onMoveIngredient} removeIngredient={onRemoveIngredient} />
                    ))}

                    {groupedLayers.base.map((ingredient, index) => (
                        <ComboLayer key={`base-${ingredient.id}-${index}`} ingredient={ingredient} index={index} isFixed moveIngredient={onMoveIngredient} removeIngredient={onRemoveIngredient} />
                    ))}

                    <div className="combo-summary__drop-hint">
                        <p>{isActive ? 'Drop to add ingredient' : 'Drag ingredients here'}</p>
                        {selectedIngredients.length === 0 && (
                            <p className="combo-summary__rules">
                                1 topping
                                <br />
                                up to 3 fillings
                                <br />
                                1 base
                            </p>
                        )}
                    </div>
                </div>
                {selectedIngredients.length > 0 &&
                    <>
                        <div className="combo-summary__total">
                            <span className="combo-summary__total-label">Total</span>
                            <span className="combo-summary__total-value">
                                € {Number(combo?.total_price ?? 0)}
                            </span>
                        </div>
                    </>
                }
                <Button
                    onClick={handleAddToCart}
                    disabled={createLoading || selectedIngredients.length === 0}
                    className="combo-summary__button"
                >
                    Add to cart
                </Button>
                {comboError && <ErrorState message={comboError} />}
                {createError && <ErrorState message={createError} />}

                <Toast message={successMessage} duration={5000} onClose={() => setSuccessMessage('')} />
            </div>
        </aside>
    );
}
