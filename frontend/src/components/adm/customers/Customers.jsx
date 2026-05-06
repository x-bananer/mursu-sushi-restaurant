import { useEffect, useState } from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import './customers.css';
import TableBase from "../../shared/table-base/tableBase";
import Button from "../../shared/button/Button";
import Modal from "../../shared/modal/modal";
import InputField from "../../shared/input-field/InputField";
import Toast from "../../shared/toast/Toast";
import Loader from "../../shared/loader/Loader";
import { fetchData } from "../../../utils/fetchData";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [manualStamps, setManualStamps] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchData("/adm/customers");
      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
        return;
      }

      setUsers([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleViewDetails(userId) {
    setError("");

    try {
      const data = await fetchData(`/adm/users/${userId}`);
      if (data && data.user) {
        setSelectedUser(data.user);
        setManualStamps(data.user.stamp_count);
        setIsOverrideMode(false);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleDiscount(user) {
    if (updatingUserId !== null) {
      return;
    }

    setError("");
    setUpdatingUserId(user.id);

    try {
      const data = await fetchData(`/adm/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_stamp_discount_active: !user.is_stamp_discount_active,
        }),
      });

      if (data && data.user) {
        setUsers((prev) =>
          prev.map((item) => {
            if (item.id === data.user.id) {
              return data.user;
            }
            return item;
          }),
        );

        if (selectedUser && selectedUser.id === data.user.id) {
          setSelectedUser(data.user);
        }
        setToast({ message: "Discount status updated." });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleSaveOverride() {
    if (!selectedUser) return;
    
    setUpdatingUserId(selectedUser.id);
    try {
      const data = await fetchData(`/adm/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stamp_count: manualStamps
        }),
      });

      if (data && data.user) {
        setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u));
        setSelectedUser(data.user);
        setIsOverrideMode(false);
        setToast({ message: "Manual override successful." });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setUpdatingUserId(null);
    }
  }

  function handleCloseDetails() {
    setSelectedUser(null);
    setIsOverrideMode(false);
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let description = "";
  if (isLoading) {
    description = "Loading users...";
  } else if (error) {
    description = error;
  } else if (users.length === 0) {
    description = "No users found.";
  } else if (filteredUsers.length === 0 && searchQuery) {
    description = "No users match your search.";
  }

  return (
    <>
      <div style={{ marginBottom: "2rem", maxWidth: "400px" }}>
        <InputField
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && <Loader text="Fetching customers..." />}

      {!isLoading && (
        <TableBase
          title="Customers"
          description={description}
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
          ]}
          data={filteredUsers}
          renderRow={(user) => {
            let discountLabel = "Activate discount";
            if (user.is_stamp_discount_active) {
              discountLabel = "Deactivate discount";
            }

            return (
              <div className="table__row" key={user.id}>
                <span>{user.name}</span>
                <span>{user.email}</span>

                <span className="table__actions">
                  <Button
                    size="small"
                    variant="dark"
                    onClick={() => handleViewDetails(user.id)}
                  >
                    View details
                  </Button>
                  <Button
                    size="small"
                    variant="gray"
                    disabled={updatingUserId === user.id}
                    onClick={() => handleToggleDiscount(user)}
                  >
                    {discountLabel}
                  </Button>
                </span>
              </div>
            );
          }}
        />
      )}

      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={handleCloseDetails}
        title="Customer details"
      >
        {selectedUser && (
          <div className="customer-details">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role_id === 2 ? "Admin" : "Customer"}</p>
            
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p><strong>Stamps:</strong> {selectedUser.stamp_count}</p>
                <Button 
                  size="small" 
                  variant="link" 
                  onClick={() => setIsOverrideMode(!isOverrideMode)}
                >
                  <HiOutlineAdjustmentsHorizontal size={16} /> 
                  {isOverrideMode ? " Cancel Override" : " Manual Override"}
                </Button>
              </div>

              {isOverrideMode && (
                <div style={{ marginTop: '1rem', background: 'rgba(255,0,0,0.05)', padding: '1rem', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                    * Manual override should only be used as a fallback.
                  </p>
                  <InputField 
                    label="Adjust Stamp Count"
                    type="number"
                    value={manualStamps}
                    onChange={(e) => setManualStamps(Number(e.target.value))}
                  />
                  <Button 
                    size="small" 
                    variant="accent" 
                    onClick={handleSaveOverride}
                    disabled={updatingUserId === selectedUser.id}
                  >
                    {updatingUserId === selectedUser.id ? "Saving..." : "Apply Changes"}
                  </Button>
                </div>
              )}
              
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Discount active:</strong> {selectedUser.is_stamp_discount_active ? "Yes" : "No"}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <Toast 
          message={toast.message} 
          className={toast.type === "error" ? "toast--error" : ""}
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}
