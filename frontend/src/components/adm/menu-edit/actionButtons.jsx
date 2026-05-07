import Button from "../../shared/button/Button";

export default function ActionButtons({
  onEdit,
  onDelete,
  onToggle,
  isActive,
}) {
  return (
    <div className="table__actions">
      {onToggle && (
        <Button
          size="small"
          variant={isActive ? "dark" : "gray"}
          className="btn--xsmall"
          onClick={onToggle}
        >
          {isActive ? "Disable" : "Enable"}
        </Button>
      )}

      {onEdit && (
        <Button
          size="small"
          variant="accent"
          className="btn--xsmall"
          onClick={onEdit}
        >
          Edit
        </Button>
      )}

      {onDelete && (
        <Button
          style={{ backgroundColor: "black" }}
          size="small"
          variant="dark"
          className="btn--xsmall"
          onClick={onDelete}
        >
          Delete
        </Button>
      )}
    </div>
  );
}
