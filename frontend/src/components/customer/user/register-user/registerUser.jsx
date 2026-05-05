import { useState } from "react";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import Loader from "../../../shared/loader/Loader";
import ErrorState from "../../../shared/error-state/ErrorState";
import { useRegisterUser } from "../../../../hooks/apiHooks/auth";
import { useNavigate } from 'react-router';

export default function RegisterUser() {
	const { register, loading, error } = useRegisterUser();
	const navigate = useNavigate();

    console.log('register: ', register);

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
    console.log('name: ', name);

	if (!name) {
    <ErrorState
      message="Name is required"
    />
		return;
	}

	try {
		await register({
			name,
			email: form.email,
			password: form.password,
		});
		if (localStorage.token) {
        	navigate("/user-profile");
      	}
	} catch (err) {
		<ErrorState
      message={err}
    />
	}
};

	// LOADING STATE
	if (loading) {
		return <Loader text="Creating account..." />;
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

			<div className="auth-card__row">
				<InputField
					label="FIRST NAME"
					name="firstName"
					value={form.firstName}
					onChange={handleChange}
					placeholder="YUKIO"
				/>

				<InputField
					label="LAST NAME"
					name="lastName"
					value={form.lastName}
					onChange={handleChange}
					placeholder="MISHIMA"
				/>
			</div>

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

			<div className="auth-card__actions">
				<Button
					variant="light"
					className="auth-card__btn"
					type="submit"
				>
					CREATE ACCOUNT
				</Button>
			</div>
		</form>
	);
}
