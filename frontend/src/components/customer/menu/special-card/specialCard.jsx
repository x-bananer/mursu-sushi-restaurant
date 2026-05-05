import "./special-card.css";
import CardBase from "../../../shared/card-base/cardBase";

export default function SpecialCard({ item }) {
  return (
    <div className="sticker">
      <div  className="sticker__card">
        <p className="sticker__label">Today's special</p>
        <CardBase
          title={item.title}
          description={item.description}
          variant="accent"
          controllers={
            <span className="sticker__benefit">15% off today</span>
          }
        />
      </div>
    </div>
  );
}
