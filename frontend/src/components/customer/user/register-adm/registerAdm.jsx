import { useState } from "react";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import Loader from "../../../shared/loader/Loader";
import ErrorState from "../../../shared/error-state/ErrorState";
import { useRegisterUser } from "../../../../hooks/apiHooks/auth";
import { useNavigate } from 'react-router';

export default function RegisterAdmin({ onSuccess }) {
	const { register, loading, error } = useRegisterUser();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		secret: "",
	});

	const handleChange = (e) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (!form.secret) {
				alert("Admin secret is required");
				return;
			}
			await register({
				name: form.name,
				email: form.email,
				password: form.password,
				role_id: 2,
				adminSecret: form.secret,
			});
			if (localStorage.token) {
        		navigate("/adm");
      		}
			onSuccess?.();
		} catch (err) {
			console.err(err);
		}
	};

	// LOADING STATE
	if (loading) {
		return <Loader text="Creating admin account..." />;
	}

	return (
		<form onSubmit={handleSubmit}>
			{/* ERROR STATE */}
			{error && (
				<ErrorState
					message={error}
					onRetry={handleSubmit}
				/>
			)}

			<InputField
				label="ADMIN NAME"
				name="name"
				value={form.name}
				onChange={handleChange}
			/>

			<InputField
				label="EMAIL ADDRESS"
				type="email"
				name="email"
				value={form.email}
				onChange={handleChange}
			/>

			<InputField
				label="PASSWORD"
				type="password"
				name="password"
				value={form.password}
				onChange={handleChange}
			/>

			<InputField
				label="ADM SECRET"
				type="password"
				name="secret"
				value={form.secret}
				onChange={handleChange}
			/>

			<div className="auth-card__actions">
				<Button
					variant="accent"
					type="submit"
				>
					REGISTER
				</Button>
			</div>
		</form>
	);
}
