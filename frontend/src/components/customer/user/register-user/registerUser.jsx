import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import Loader from "../../../shared/loader/Loader";
import ErrorState from "../../../shared/error-state/ErrorState";
import { useRegisterUser } from "../../../../hooks/apiHooks/auth";
import { useNavigate } from "react-router";

export default function RegisterUser() {
	const { t } = useTranslation();
	const { register, loading, error } = useRegisterUser();
	const navigate = useNavigate();

	console.log("register: ", register);

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const name = `${form.firstName} ${form.lastName}`.trim();
		console.log("name: ", name);

		if (!name) {
			alert(t("auth.alert_name_required"));
			return;
		}

		try {
			const res = await register({
				name,
				email: form.email,
				password: form.password,
			});

			if (res?.token) {
				navigate("/user-profile");
			}
		} catch (err) {
			console.error(err);
		}
	};

	// LOADING STATE
	if (loading) {
		return <Loader text={t("auth.creating_account")} />;
	}

	return (
		<form onSubmit={handleSubmit}>
			{/* ERROR STATE */}
			{error && <ErrorState message={error} onRetry={handleSubmit} />}

			<div className="auth-card__row">
				<InputField
					label={t("auth.first_name")}
					name="firstName"
					value={form.firstName}
					onChange={handleChange}
				/>

				<InputField
					label={t("auth.last_name")}
					name="lastName"
					value={form.lastName}
					onChange={handleChange}
				/>
			</div>

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

			<div className="auth-card__actions">
				<Button
					variant="light"
					className="auth-card__btn"
					type="submit"
				>
					{t("auth.register")}
				</Button>
			</div>
		</form>
	);
}
