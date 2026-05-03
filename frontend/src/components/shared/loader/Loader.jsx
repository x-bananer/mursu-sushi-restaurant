import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./loader.css";

export default function Loader({ size = 24, text, className = "" }) {
  return (
    <div className={`loader ${className}`}>
      <AiOutlineLoading3Quarters
        className="loader__icon"
        size={size}
      />
      {text && <p className="loader__text">{text}</p>}
    </div>
  );
}
