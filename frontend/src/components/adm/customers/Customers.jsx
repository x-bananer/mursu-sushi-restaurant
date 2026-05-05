import './customers.css';
import TableBase from "../../shared/table-base/tableBase";
import Button from "../../shared/button/Button";

export default function Customers() {
  return (
    <TableBase
      title="Customers"
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
      ]}
      data={users}
      renderRow={(user) => (
        <div className="table__row" key={user.id}>
          <span>{user.name}</span>
          <span>{user.email}</span>

          <span className="table__actions">
            <Button size="small" variant="dark">
              View details
            </Button>
          </span>
        </div>
      )}
    />
  );
}


const users = [
  { id: 1, name: "John Doe", email: "john@test.com" },
  { id: 2, name: "Jane Smith", email: "jane@test.com" },
];
