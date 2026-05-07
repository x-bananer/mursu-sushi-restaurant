import { useEffect, useState } from "react";
import { HiOutlineUser } from "react-icons/hi2";
import Button from "../../components/shared/button/Button";
import Modal from "../../components/shared/modal/modal";
import Toast from "../../components/shared/toast/Toast";
import Loader from "../../components/shared/loader/Loader";
import ErrorState from "../../components/shared/error-state/ErrorState";

import LoyaltyStamps from "../../components/customer/user/profile/LoyaltyStamps";
import ProfileEditForm from "../../components/customer/user/profile/ProfileEditForm";

import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../hooks/apiHooks/user";

export default function AdmProfile() {
    const { user, logout } = useAuth();
    const { getProfile, updateProfile, deleteAccount, isLoading, error } = useUser();

    const [profile, setProfile] = useState(user);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await getProfile();
            if (data) setProfile(data);
        }
        load();
    }, [getProfile]);

    const handleSaveProfile = async (payload, photoFile) => {
        setIsSaving(true);
        try {
            const updatedUser = await updateProfile(payload, photoFile);
            if (updatedUser) {
                setProfile(updatedUser);
                setToast({ message: "Profile updated successfully!" });
                setIsEditModalOpen(false);
            }
        } catch (err) {
            setToast({ message: err.message || "Failed to update profile", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Delete your account? This cannot be undone.");
        if (!confirmed) return;

        setIsDeleting(true);
        const success = await deleteAccount();
        if (!success) {
            setToast({ message: "Failed to delete account", type: "error" });
            setIsDeleting(false);
        }
    };

    if (isLoading && !profile) {
        return <Loader size={48} text="Loading profile..." className="page-loader" />;
    }

    if (error && !profile) {
        return <ErrorState message={error} onRetry={getProfile} />;
    }

    if (profile && profile.role_id !== 2) {
	    return (
		    <ErrorState message="User type must be administrative account." />
	    );
    }

    const displayName = profile?.name ||  <ErrorState message="User must have a name" />;
    const regDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "";
    const metaText = profile?.email ? `${profile.email} ${regDate ? `• Joined ${regDate}` : ""}` : <ErrorState message="User must have an email" />;

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
                                <HiOutlineUser size={32} />
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
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="gray"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </div>
                </section>

            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Profile"
            >
                <ProfileEditForm
                    user={profile}
                    onSave={handleSaveProfile}
                    onDelete={handleDeleteAccount}
                    isSaving={isSaving}
                    isDeleting={isDeleting}
                />
            </Modal>

            {toast && (
                <Toast
                    message={toast.message}
                    className={toast.type === "error" ? "toast--error" : ""}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
