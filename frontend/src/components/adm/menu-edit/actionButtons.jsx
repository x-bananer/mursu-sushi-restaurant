import Button from "../../shared/button/Button";
import { useTranslation } from "react-i18next";

export default function ActionButtons({
	onEdit,
	onDelete,
	onToggle,
	isActive,
}) {
	const { t } = useTranslation();

	return (
		<div className="table__actions">
			{onToggle && (
				<Button
					size="small"
					variant={isActive ? "dark" : "gray"}
					className="btn--xsmall"
					onClick={onToggle}
				>
					{isActive
						? t("common.available")
						: t("common.not_available")}
				</Button>
			)}

			{onEdit && (
				<Button
					size="small"
					variant="accent"
					className="btn--xsmall"
					onClick={onEdit}
				>
					{t("common.edit")}
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
					{t("common.delete")}
				</Button>
			)}
		</div>
	);
}
