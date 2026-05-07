import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import useForm from "../../../../hooks/formHooks";

/**
 * Reusable form for editing user profile details.
 */
export default function ProfileEditForm({ user, onSave, onDelete, isSaving, isDeleting }) {
	const { t } = useTranslation();
	const {
		inputs,
		handleInputChange,
	} = useForm(() => {}, {
		name: user?.name || "",
		email: user?.email || "",
		password: "",
	});

	const [photoFile, setPhotoFile] = useState(null);

	const handlePhotoChange = (event) => {
		const file = event.target.files && event.target.files[0];
		setPhotoFile(file || null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = {};
		if (inputs.name !== user.name) payload.name = inputs.name;
		if (inputs.email !== user.email) payload.email = inputs.email;
		if (inputs.password) payload.password = inputs.password;
		
		onSave(payload, photoFile);
	};

	return (
		<form className="profile-edit-form" onSubmit={handleSubmit}>
			<InputField
				label={t("profile.name")}
				name="name"
				value={inputs.name}
				onChange={handleInputChange}
				required
			/>
			<InputField
				label={t("profile.email")}
				name="email"
				type="email"
				value={inputs.email}
				onChange={handleInputChange}
				required
			/>
			<InputField
				label={t("profile.new_password_optional")}
				name="password"
				type="password"
				value={inputs.password}
				onChange={handleInputChange}
				placeholder={t("profile.new_password_placeholder")}
			/>
			<InputField
				label={t("profile.photo")}
				name="photo"
				type="file"
				accept="image/*"
				onChange={handlePhotoChange}
			/>

			<div className="profile-edit-form__actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
				<Button
					variant="light"
					type="submit"
					disabled={isSaving || isDeleting}
				>
					{isSaving ? t("admin.saving") : t("common.save")}
				</Button>
				<Button
					variant="gray"
					type="button"
					disabled={isSaving || isDeleting}
					onClick={onDelete}
				>
					{isDeleting ? t("profile.deleting") : t("profile.delete_account")}
				</Button>
			</div>
		</form>
	);
}
