import "./input-field.css";

// Props:
// default: text input without label
// label: text above input
export default function InputField({ label, ...props }) {
	return (
		<label className="input-field">
			{label ? <span className="input-field__label">{label}</span> : null}
			<input className="input-field__input" {...props} />
		</label>
	);
}
