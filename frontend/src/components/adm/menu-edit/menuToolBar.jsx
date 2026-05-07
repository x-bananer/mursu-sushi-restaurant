import { useTranslation } from "react-i18next";
import InputField from "../../shared/input-field/InputField";
import Button from "../../shared/button/Button";

export default function MenuToolbar({
	search,
	onSearchChange,
	sort,
	onSortChange,
	sortOptions = [],
	onCreate,
	createLabel = "+ Create",
	variant = "long",
}) {
	const { t } = useTranslation();

	return (
		<div
			className={`menu-toolbar--long ${
				variant === "long" ? "menu-toolbar--long" : ""
			}`}
		>
			{/* BUTTON GROUP */}
			<div className="menu-toolbar__group">
				{sortOptions.map((opt) => (
					<Button
						key={opt.value}
						size="small"
						variant={sort === opt.value ? "accent" : "dark"}
						onClick={() => onSortChange(opt.value)}
						className="menu-toolbar__btn"
					>
						{opt.label}
					</Button>
				))}

				{onCreate && (
					<Button
						size="small"
						variant="accent"
						onClick={onCreate}
						className="menu-toolbar__btn"
					>
						{createLabel}
					</Button>
				)}
			</div>
			{/* SEARCH */}
			<div className="menu-toolbar__search">
				<InputField
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t("common.search")}
				/>
			</div>
		</div>
	);
}
