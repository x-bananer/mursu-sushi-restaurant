import './cart-item.css';

import ButtonCounter from '../../../shared/button-counter/ButtonCounter';
import Button from '../../../shared/button/Button';

export default function CartItem({ item, quantity, onIncrease, onDecrease, onRemove }) {
    const visibleQuantity = quantity ?? item.quantity;
    const totalItemPrice = item.price * visibleQuantity;
    const isDish = item?.type?.type === 'dish';

    return (
        <article className="cart-item">
            <div className="cart-item__content">
                <div className="cart-item__main">
                    <h2 className="cart-item__title">
                        {isDish ? item.dish?.name : 'Custom set #' + item.id}
                    </h2>
                    <p className="cart-item__description">
                        {isDish ? item.dish?.description : item.ingredients.map(ingredient => ingredient.ingredient.name + ` (${ingredient.quantity})`).join(', ')}
                    </p>
                    {onRemove && (
                        <Button
                            className="cart-item__btn"
                            variant="link"
                            onClick={onRemove}
                        >
                            Remove
                        </Button>
                    )}
                </div>
                <div className="cart-item__aside">
                    <p className="cart-item__price">€{totalItemPrice}</p>
                    {isDish &&
                        <ButtonCounter
                            value={visibleQuantity}
                            onPlus={onIncrease}
                            onMinus={onDecrease}
                        />
                    }
                </div>
            </div>
        </article>
    )
}
