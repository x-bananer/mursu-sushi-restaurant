import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./loader.css";

export default function Loader({
	size = 24,
	text,
	className = "",
	isLight = false,
}) {
	return (
		<div
			className={`loader ${isLight ? "loader--light" : ""} ${className}`}
		>
			<AiOutlineLoading3Quarters className="loader__icon" size={size} />
			{text && <p className="loader__text">{text}</p>}
		</div>
	);
}
