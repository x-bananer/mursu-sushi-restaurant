import './combo-summary.css';
import { useTranslation } from "react-i18next";

import Button from '../../../shared/button/Button';
import Toast from '../../../shared/toast/Toast';
import ComboLayer from '../combo-layer/ComboLayer';
import ErrorState from '../../../shared/error-state/ErrorState';

import { useDrop } from 'react-dnd';
import { useState } from 'react';
import { useComboPreview } from '../../../../hooks/apiHooks/combo';
import { useCartContext } from '../../../../hooks/contextHooks/cart';

export default function ComboSummary({
    selectedIngredients = [],
    onAddIngredient,
    onRemoveIngredient,
    onMoveIngredient,
    onClearSelectedIngredients,
}) {
    const { t } = useTranslation();
    const [successMessage, setSuccessMessage] = useState('');
    const { addComboToCart, cartActionLoading, cartActionError } = useCartContext();

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

    const handleAddToCart = async () => {
        const cart = await addComboToCart(ingredientsForPreview);

        if (!cart) return;

        onClearSelectedIngredients();
        setSuccessMessage(t("combo.added_success"));
    };

    return (
        <aside className="combo-summary">
            <div className="combo-summary__container">
                <h2 className="combo-summary__title">{t("combo.your_set")}</h2>
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
                        <p>{isActive ? t("combo.drop_to_add") : t("combo.drag_here")}</p>
                        {selectedIngredients.length === 0 && (
                            <p className="combo-summary__rules">
                                {t("combo.rules_line_1")}
                                <br />
                                {t("combo.rules_line_2")}
                                <br />
                                {t("combo.rules_line_3")}
                            </p>
                        )}
                    </div>
                </div>
                {selectedIngredients.length > 0 &&
                    <>
                        <div className="combo-summary__total">
                            <span className="combo-summary__total-label">{t("combo.total")}</span>
                            <span className="combo-summary__total-value">
                                € {Number(combo?.total_price ?? 0)}
                            </span>
                        </div>
                    </>
                }
                <Button
                    onClick={handleAddToCart}
                    disabled={cartActionLoading || selectedIngredients.length === 0}
                    className="combo-summary__button"
                >
                    {t("combo.add_to_cart")}
                </Button>
                {comboError && <ErrorState message={comboError} />}
                {cartActionError && <ErrorState message={cartActionError} />}

                <Toast message={successMessage} duration={5000} onClose={() => setSuccessMessage('')} />
            </div>
        </aside>
    );
}
