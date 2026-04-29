import './combo-card.css';

import { useState } from 'react'

import Button from '../../../shared/button/Button';
import ButtonCounter from '../../../shared/button-counter/ButtonCounter';

export default function ComboCard() {
    const [isSelected, setIsSelected] = useState(false);
    const [counter, setCounter] = useState(0);

    const handleOnMinus = () => {
        if (counter > 0) {
            setCounter(counter--);
        }
    };

    const handleOnPlus = () => {
        setCounter(counter++);
    };

    return (
        <article className={`combo-card ${counter > 0 ?? 'combo-card--selected' }`} type="button">
            <span className="combo-card__title">Udon Silk</span>
            <span className="combo-card__text">
                Hand-pulled wheat
            </span>
            <span className="combo-card__price">9.00</span>
            {counter > 0 ?
                <>
                    <span className="combo-card__mobile-action">
                        <ButtonCounter value={counter} onMinus={handleOnMinus} onPlus={handleOnPlus} />
                    </span>
                    <span className="combo-card__badge">{counter}</span>
                </>
                :
                <span className="combo-card__mobile-action">
                    <Button onClick={handleOnPlus} variant="light" size="small">
                        + ADD
                    </Button>
                </span>
            }
        </article>
    )
}
