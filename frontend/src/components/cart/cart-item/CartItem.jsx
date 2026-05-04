import './cart-item.css';

import ButtonCounter from '../../../components/shared/button-counter/ButtonCounter';
import Button from '../../../components/shared/button/Button';

export default function CartItem() {
    return (
        <article className="cart-item">
            <div className="cart-item__content">
                <div className="cart-item__main">
                    <h2 className="cart-item__title">
                        Sake Sashimi
                    </h2>
                    <p className="cart-item__description">
                        Premium Atlantic salmon, hand-sliced,
                        served with fresh wasabi and aged soy.
                    </p>
                    <Button
                        className="cart-item__btn"
                        variant="link"
                    >
                        Remove
                    </Button>
                </div>
                <div className="cart-item__aside">
                    <p className="cart-item__price">€24.00</p>
                    <ButtonCounter />
                </div>
            </div>
        </article>
    )
}
