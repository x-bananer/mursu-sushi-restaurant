import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import Loader from "../../../shared/loader/Loader";
import ErrorState from "../../../shared/error-state/ErrorState";
import { useRegisterUser } from "../../../../hooks/apiHooks/auth";
import { useNavigate } from 'react-router';

export default function RegisterAdmin({ onSuccess }) {
	const { t } = useTranslation();
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
				alert(t("auth.alert_admin_secret_required"));
				return;
			}
			const res = await register({
				name: form.name,
				email: form.email,
				password: form.password,
				role_id: 2,
				adminSecret: form.secret,
			});
			if (res?.token) {
        		navigate("/adm");
      		}
			onSuccess?.();
		} catch (err) {
			console.error(err);
		}
	};

	// LOADING STATE
	if (loading) {
		return <Loader text={t("auth.creating_admin")} />;
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
				label={t("auth.admin_name")}
				name="name"
				value={form.name}
				onChange={handleChange}
			/>

			<InputField
				label={t("auth.email")}
				type="email"
				name="email"
				value={form.email}
				onChange={handleChange}
			/>

			<InputField
				label={t("auth.password")}
				type="password"
				name="password"
				value={form.password}
				onChange={handleChange}
			/>

			<InputField
				label={t("auth.admin_secret")}
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
					{t("auth.register")}
				</Button>
			</div>
		</form>
	);
}
