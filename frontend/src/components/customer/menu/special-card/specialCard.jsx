import "./special-card.css";
import { useTranslation } from "react-i18next";

export default function SpecialCard({ item }) {
	const { t } = useTranslation();
	return (
		<div className="special-card">
			<div className="special-card__card">
				<p className="special-card__label">{t("menu.today_special")}</p>
				<h3 className="special-card__title">{item?.title}</h3>
				<p className="special-card__description">{item?.description}</p>
				<div className="special-card__footer">
					<span className="special-card__benefit">
						{t("menu.today_special_discount")}
					</span>
				</div>
			</div>
		</div>
	);
}
