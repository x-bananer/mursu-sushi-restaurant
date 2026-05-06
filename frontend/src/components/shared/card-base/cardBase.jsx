import "./card-base.css";
import Badge from "../badge/Badge";

/**
 * usage:
 * title - string
 * price - number
 * description - string
 * tags - string[]
 * variant - "light" | "dark" | "transparent" | "accent"
 * controllers - injected actions (user/admin buttons)
 */

export default function CardBase({
  title,
  price = null,
  description,
  tags = [],
  variant = "dark",
  controllers,
}) {
  return (
    <article className={`card-base card-base--${variant}`}>
      <div className="card-base__head">
        <h2 className="card-base__title">{title}</h2>
        <p className="card-base__price">{price ? `${price.toFixed(2)} €` : ''}</p>
      </div>

      {tags.length > 0 && (
        <div className="card-base__badges">
          {tags.map((tag, index) => (
            <Badge key={tag?.id ?? `badge-${index}`}>
              {tag?.name}
            </Badge>
          ))}
        </div>
      )}

      <p className="card-base__description">{description}</p>

      <div className="card-base__footer">{controllers}</div>
    </article>
  );
}
