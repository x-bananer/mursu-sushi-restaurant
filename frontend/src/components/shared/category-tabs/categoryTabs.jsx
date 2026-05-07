import "./category-tabs.css";

/**
 * usage:
 * categories - string[]
 * active - string
 * onChange: (category - string) => func;
 */
export default function CategoryTabs({ categories, active, onChange }) {
	return (
		<section className="category-tabs">
			<div className="category-tabs__list">
				{/* ALL TAB */}
				<button
					type="button"
					className={`category-tabs__button ${
						active === "all" ? "category-tabs__button--active" : ""
					}`}
					onClick={() => onChange("all")}
				>
					All
				</button>

				{/* DYNAMIC CATEGORIES */}
				{categories.map((cat) => (
					<button
						key={cat.id}
						type="button"
						className={`category-tabs__button ${
							String(active) === String(cat.id)
								? "category-tabs__button--active"
								: ""
						}`}
						onClick={() => onChange(String(cat.id))}
					>
						{cat.name}
					</button>
				))}
			</div>
		</section>
	);
}
