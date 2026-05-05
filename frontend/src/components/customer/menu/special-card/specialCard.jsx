import "./special-card.css";

export default function SpecialCard({ item }) {
  return (
    <div className="special-card">
      <div className="special-card__card">
        <p className="special-card__label">Today's special</p>
        <h3 className="special-card__title">{item?.title}</h3>
        <p className="special-card__description">{item?.description}</p>
        <div className="special-card__footer">
          <span className="special-card__benefit">10% off today</span>
        </div>
      </div>
    </div>
  );
}
