import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./assets/styles/index.css";

if (!localStorage.getItem("session_id")) {
	localStorage.setItem("session_id", crypto.randomUUID());
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
