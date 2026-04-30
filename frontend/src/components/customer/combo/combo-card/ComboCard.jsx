import './combo-card.css';

import { useState } from 'react';
import { useDrag } from 'react-dnd';

import Button from '../../../shared/button/Button';
import ButtonCounter from '../../../shared/button-counter/ButtonCounter';

export default function ComboCard({ ingredient }) {
    const [counter, setCounter] = useState(0);

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'ingredient',
        item: ingredient,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [ingredient]);

    const handleOnMinus = () => {
        if (counter > 0) {
            setCounter((prev) => prev - 1);
        }

    };

    const handleOnPlus = () => {
        setCounter((prev) => prev + 1);
    };

    return (
        <article
            ref={dragRef}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={`combo-card ${counter > 0 ? 'combo-card--selected' : ''}`}
        >
            <span className="combo-card__title">{ingredient?.name}</span>
            <span className="combo-card__price">€{ingredient?.price}</span>
            {counter > 0 ? (
                <>
                    <span className="combo-card__mobile-action">
                        <ButtonCounter
                            value={counter}
                            onMinus={handleOnMinus}
                            onPlus={handleOnPlus}
                        />
                    </span>
                    <span className="combo-card__badge">{counter}</span>
                </>
            ) : (
                <span className="combo-card__mobile-action">
                    <Button onClick={handleOnPlus} variant="light" size="small">
                        + ADD
                    </Button>
                </span>
            )}
        </article>
    );
}
