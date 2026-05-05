import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import InputField from "../../../components/shared/input-field/InputField";
import Button from "../../../components/shared/button/Button";
import { fetchData } from "../../../utils/fetchData";
import { useAuth } from "../../../contexts/AuthContext";
import useForm from "../../../hooks/formHooks";
import "./user-profile.css";

export default function UserProfile() {
	const { user, updateUser, logout } = useAuth();
	const [profile, setProfile] = useState(user);
	const {
		inputs,
		setInputs,
		handleInputChange,
	} = useForm(() => {}, {
		name: user?.name || "",
		email: user?.email || "",
	});
	const [photoFile, setPhotoFile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/auth", { replace: true });
			return;
		}
		loadProfile();
	}, [user?.id, navigate]);

	async function loadProfile() {
		setError("");
		try {
			const data = await fetchData("/users/me");
			if (data && data.user) {
				setProfile(data.user);
				updateUser(data.user);
				setInputs({
					name: data.user.name || "",
					email: data.user.email || "",
				});
			}
		} catch (err) {
			setError(err.message);
		}
	}

	function handlePhotoChange(event) {
		const file = event.target.files && event.target.files[0];
		if (file) {
			setPhotoFile(file);
			return;
		}

		setPhotoFile(null);
	}

	function handleEditStart() {
		setNotice("");
		setError("");
		setIsEditing(true);
	}

	async function handleSave() {
		if (isSaving || !profile) {
			return;
		}

		setError("");
		setNotice("");

		const trimmedName = inputs.name.trim();
		const trimmedEmail = inputs.email.trim();

		if (!trimmedName || !trimmedEmail) {
			setError("Name and email are required.");
			return;
		}

		const payload = {};
		const hasPhoto = Boolean(photoFile);
		if (trimmedName !== profile.name) {
			payload.name = trimmedName;
		}
		if (trimmedEmail !== profile.email) {
			payload.email = trimmedEmail;
		}

		if (Object.keys(payload).length === 0 && !hasPhoto) {
			setIsEditing(false);
			return;
		}

		setIsSaving(true);
		try {
			let data = null;
			if (hasPhoto) {
				const formData = new FormData();
				if (payload.name) {
					formData.append("name", payload.name);
				}
				if (payload.email) {
					formData.append("email", payload.email);
				}
				formData.append("photo", photoFile);

				data = await fetchData("/users/me", {
					method: "PATCH",
					body: formData,
				});
			} else {
				data = await fetchData("/users/me", {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});
			}

			if (data && data.user) {
				setProfile(data.user);
				updateUser(data.user);
				setInputs({
					name: data.user.name || "",
					email: data.user.email || "",
				});
				setPhotoFile(null);
				setNotice("Profile updated.");
			}

			setIsEditing(false);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDelete() {
		if (!profile || isDeleting) {
			return;
		}

		const confirmed = window.confirm(
			"Delete your account? This cannot be undone.",
		);
		if (!confirmed) {
			return;
		}

		setError("");
		setNotice("");
		setIsDeleting(true);
		try {
			await fetchData("/users/me", { method: "DELETE" });
			logout();
			setProfile(null);
			setInputs({ name: "", email: "" });
			setPhotoFile(null);
			setNotice("Account deleted.");
		} catch (err) {
			setError(err.message);
		} finally {
			setIsDeleting(false);
		}
	}

	let displayName = "Guest";
	if (profile && profile.name) {
		displayName = profile.name;
	}

	let metaText = "Sign in to view your profile.";
	if (profile && profile.email) {
		metaText = profile.email;
	}
	if (notice) {
		metaText = notice;
	}
	if (error) {
		metaText = error;
	}

	const stampGoal = 5;
	const stampCount = profile ? profile.stamp_count : 0;
	const isStampDiscountActive = profile ? profile.is_stamp_discount_active : false;
	const stampsLeft = Math.max(0, stampGoal - stampCount);
	const loyaltyHint = isStampDiscountActive
		? "10% discount is active for your next order"
		: `${stampsLeft} more purchase${stampsLeft === 1 ? "" : "s"} to unlock 10% on your next order`;

	let actionLabel = "Edit Profile";
	if (isEditing) {
		if (isSaving) {
			actionLabel = "Saving...";
		} else {
			actionLabel = "Save Changes";
		}
	}

	let actionHandler = handleEditStart;
	if (isEditing) {
		actionHandler = handleSave;
	}

	let actionDisabled = isSaving || isDeleting;
	if (!profile) {
		actionDisabled = true;
	}

	let fieldDisabled = !isEditing || isDeleting;
	if (isSaving) {
		fieldDisabled = true;
	}

	let deleteDisabled = isDeleting || isSaving;
	if (!profile) {
		deleteDisabled = true;
	}

	let deleteLabel = "Delete Account";
	if (isDeleting) {
		deleteLabel = "Deleting...";
	}

	return (
		<div className="profile">
			<div className="profile__container">
				<section className="profile__header">
					<div className="profile__user">
						<div className="profile__avatar">
							{profile?.photo_url ? (
								<img 
									src={profile.photo_url} 
									alt={displayName} 
									className="profile__avatar-img"
								/>
							) : (
								<svg
									viewBox="0 0 48 48"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle
										cx="24"
										cy="24"
										r="18"
										stroke="currentColor"
										strokeWidth="2"
									/>
									<circle
										cx="24"
										cy="18"
										r="5"
										stroke="currentColor"
										strokeWidth="2"
									/>
									<path
										d="M14 34C14 29 18 26 24 26C30 26 34 29 34 34"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							)}
						</div>
						<div className="profile__identity">
							<h1 className="profile__name">{displayName}</h1>
							<p className="profile__meta">{metaText}</p>
						</div>
					</div>
					<div className="profile__actions">
						<Button
							variant="light"
							type="button"
							disabled={actionDisabled}
							onClick={actionHandler}
						>
							{actionLabel}
						</Button>
						<Button
							variant="gray"
							type="button"
							disabled={deleteDisabled}
							onClick={handleDelete}
						>
							{deleteLabel}
						</Button>
					</div>
				</section>
				<section className="profile__content">
					<InputField
						label="Name"
						name="name"
						value={inputs.name}
						onChange={handleInputChange}
						disabled={fieldDisabled}
					/>
					<InputField
						label="Email"
						name="email"
						type="email"
						value={inputs.email}
						onChange={handleInputChange}
						disabled={fieldDisabled}
					/>
					<InputField
						label="Photo"
						name="photo"
						type="file"
						accept="image/*"
						onChange={handlePhotoChange}
						disabled={fieldDisabled}
					/>
				</section>
				<section className="profile__stats">
					<section className="profile-loyalty">
						<p className="profile-loyalty__label">Loyalty Stamps</p>
						<div className="profile-loyalty__stamps">
							{Array.from({ length: stampGoal }).map((_, index) => {
								const isActive = index < stampCount;
								return (
									<span
										key={index}
										className={`profile-loyalty__stamp${isActive ? " profile-loyalty__stamp--active" : ""}`}
									>
										{isActive ? "★" : ""}
									</span>
								);
							})}
						</div>
						<p className="profile-loyalty__hint">{loyaltyHint}</p>
					</section>
					<div className="profile__stats-side">
						<section className="profile-stat-card">
							<p className="profile-stat-card__label">
								Next Milestone
							</p>
							<p className="profile-stat-card__value">10% off</p>
						</section>
						<section className="profile-stat-card profile-stat-card--light">
							<p className="profile-stat-card__label">
								Rewards Earned
							</p>
							<p className="profile-stat-card__value">{stampCount}</p>
						</section>
					</div>
				</section>
			</div>
		</div>
	);
}
