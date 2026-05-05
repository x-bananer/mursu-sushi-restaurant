import { useEffect, useState } from "react";
import './customers.css';
import TableBase from "../../shared/table-base/tableBase";
import Button from "../../shared/button/Button";
import Modal from "../../shared/modal/modal";
import { fetchData } from "../../../utils/fetchData";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

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
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  function handleCloseDetails() {
    setSelectedUser(null);
  }

  let description = "";
  if (isLoading) {
    description = "Loading users...";
  } else if (error) {
    description = error;
  } else if (users.length === 0) {
    description = "No users found.";
  }

  return (
    <>
      <TableBase
        title="Customers"
        description={description}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
        ]}
        data={users}
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
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={handleCloseDetails}
        title="Customer details"
      >
        {selectedUser && (
          <div>
            <p>Name: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Role: {selectedUser.role_id}</p>
            <p>Stamps: {selectedUser.stamp_count}</p>
            <p>
              Discount active: {String(selectedUser.is_stamp_discount_active)}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
