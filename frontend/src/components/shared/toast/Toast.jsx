import './toast.css';
import { useEffect } from 'react';

export default function Toast({ message, duration = 5000, onClose, className = '' }) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timeout);
    }, [message, duration, onClose]);

    if (!message) {
        return null;
    }

    return (
        <div
            className={`toast ${className}`}
        >
            {message}
        </div>
    );
}
