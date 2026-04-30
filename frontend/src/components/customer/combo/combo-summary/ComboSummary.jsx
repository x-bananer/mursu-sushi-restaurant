import './combo-summary.css';

import Button from '../../../shared/button/Button';
import ComboLayer from '../combo-layer/ComboLayer';

import { useDrop } from 'react-dnd';
import { useState } from 'react';
import { useComboPreview, useCreateCombo } from '../../../../hooks/apiHooks/combo';

export default function ComboSummary() {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const [{ isOver, canDrop }, ingredientDropRef] = useDrop(
        () => ({
            accept: 'ingredient',
            drop: (ingredient) => {
                addIngredient(ingredient);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        []
    );

    const addIngredient = (ingredient) => {
        setSelectedIngredients((prev) => {
            const ingredientWithUid = { ...ingredient, uid: `${Date.now()}-${Math.random()}` };
            const type = ingredient?.type?.type;

            // exactly one topping
            if (type === 'topping') {
                const notToppingIngredients = prev.filter((item) => item?.type?.type !== 'topping');
                return [...notToppingIngredients, ingredientWithUid];
            }

            // up to three fillings
            if (type === 'filling') {
                const fillingIngredients = prev.filter((item) => item?.type?.type === 'filling');
                const notFillingIngredients = prev.filter((item) => item?.type?.type !== 'filling');
                const newFillingIngredients = [ingredientWithUid, ...fillingIngredients].slice(0, 3);

                return [...notFillingIngredients, ...newFillingIngredients];
            }

            // exactly one base
            if (type === 'base') {
                const notBaseIngredients = prev.filter((item) => item?.type?.type !== 'base');
                return [...notBaseIngredients, ingredientWithUid];
            }

            return [...prev, ingredientWithUid];
        });
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

    const removeIngredient = (uid) => {
        setSelectedIngredients((prev) => prev.filter((item) => item?.uid !== uid));
    };

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

    const { combo, loading: comboLoading, error: comboError } = useComboPreview(ingredientsForPreview);

    const isActive = isOver && canDrop;

    const { createCombo, loading: createLoading, error: createError } = useCreateCombo();

    const handleAddToCart = async () => {
        const sessionId = localStorage.getItem('session_id');
        await createCombo(ingredientsForPreview, sessionId);
        setSelectedIngredients([]);

        setSuccessMessage('Your oshi-sushi set has been successfully added to the cart!');
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
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
                        <ComboLayer key={`topping-${ingredient.id}-${index}`} ingredient={ingredient} index={index} isFixed moveIngredient={moveIngredient} removeIngredient={removeIngredient} />
                    ))}
                    {groupedLayers.filling.map((ingredient, index) => (
                        <ComboLayer key={`filling-${ingredient.id}-${index}`} ingredient={ingredient} index={index} moveIngredient={moveIngredient} removeIngredient={removeIngredient} />
                    ))}

                    {groupedLayers.base.map((ingredient, index) => (
                        <ComboLayer key={`base-${ingredient.id}-${index}`} ingredient={ingredient} index={index} isFixed moveIngredient={moveIngredient} removeIngredient={removeIngredient} />
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
                {createError && (
                    <p className="combo-summary__error">{createError}</p>
                )}

                {successMessage && (
                    <div className="combo-summary__toast">{successMessage}</div>
                )}

            </div>
        </aside>
    );
}
