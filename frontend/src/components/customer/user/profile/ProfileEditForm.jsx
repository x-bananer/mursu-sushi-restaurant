import { useState } from "react";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import useForm from "../../../../hooks/formHooks";

/**
 * Reusable form for editing user profile details.
 */
export default function ProfileEditForm({ user, onSave, onDelete, isSaving, isDeleting }) {
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
				label="Name"
				name="name"
				value={inputs.name}
				onChange={handleInputChange}
				required
			/>
			<InputField
				label="Email"
				name="email"
				type="email"
				value={inputs.email}
				onChange={handleInputChange}
				required
			/>
			<InputField
				label="New Password (optional)"
				name="password"
				type="password"
				value={inputs.password}
				onChange={handleInputChange}
				placeholder="Leave empty to keep current"
			/>
			<InputField
				label="Photo"
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
					{isSaving ? "Saving..." : "Save Changes"}
				</Button>
				<Button
					variant="gray"
					type="button"
					disabled={isSaving || isDeleting}
					onClick={onDelete}
				>
					{isDeleting ? "Deleting..." : "Delete Account"}
				</Button>
			</div>
		</form>
	);
}
