import './combo-layer.css';

import Button from '../../../shared/button/Button';

import { useDrag, useDrop } from 'react-dnd';

export default function ComboLayer({ isFixed, ingredient, index, moveIngredient, removeIngredient }) {

    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: 'layer',
            item: { fromIndex: index, toIndex: index, type: 'filling' },
            canDrag: !isFixed,
        }),
        [ingredient, index, isFixed]
    );

    const [, dropRef] = useDrop(
        () => ({
            accept: 'layer',
            hover: (dragItem) => {
                if (!isFixed && dragItem.fromIndex !== index) {
                    moveIngredient({
                        fromIndex: dragItem.fromIndex,
                        toIndex: index,
                    });

                    dragItem.fromIndex = index;
                    dragItem.toIndex = index;
                }
            },
        }),
        [index, isFixed, moveIngredient]
    );

    const handleRemove = () => {
        removeIngredient(ingredient?.uid);
    };

    return (
        <article
            ref={(node) => {
                dragRef(node);
                dropRef(node);
            }}
            className={`combo-layer ${isFixed ? 'combo-layer--fixed' : 'combo-layer--draggable'}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            {isFixed ?
                <div className="combo-layer__aside combo-layer__aside--left">
                    <svg
                        className="combo-layer__lock"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8 10V7.5C8 5.567 9.567 4 11.5 4H12.5C14.433 4 16 5.567 16 7.5V10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <rect
                            x="6.5"
                            y={10}
                            width={11}
                            height={9}
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </div>
                :
                <div className="combo-layer__aside combo-layer__aside--left">
                    <span className="combo-layer__handle">⋮⋮</span>
                </div>
            }
            <div className="combo-layer__main">
                <p className="combo-layer__title">{ingredient.name}</p>
                <p className="combo-layer__type">{ingredient.type.name}</p>
            </div>
            <div className="combo-layer__aside combo-layer__aside--right">
                <span className="combo-layer__price">€{ingredient.price}</span>
                <Button
                    className="combo-layer__btn"
                    variant="link"
                    onClick={handleRemove}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7 7L17 17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M17 7L7 17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </Button>
            </div>
        </article>
    )
}
