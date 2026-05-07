import "./modal.css";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
	// ESC to close
	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleKey);
		}

		return () => {
			document.removeEventListener("keydown", handleKey);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				{/* HEADER */}
				<div className="modal__header">
					{title && <h3 className="modal__title">{title}</h3>}

					<button className="modal__close" onClick={onClose}>
						✕
					</button>
				</div>

				{/* CONTENT */}
				<div className="modal__content">{children}</div>
			</div>
		</div>
	);
}
