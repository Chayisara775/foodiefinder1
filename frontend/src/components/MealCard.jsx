
import { Heart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context";

const countryCodes = {
  American: "us",
  British: "gb",
  Canadian: "ca",
  Chinese: "cn",
  Croatian: "hr",
  Dutch: "nl",
  Egyptian: "eg",
  Filipino: "ph",
  French: "fr",
  Greek: "gr",
  Indian: "in",
  Irish: "ie",
  Italian: "it",
  Jamaican: "jm",
  Japanese: "jp",
  Kenyan: "ke",
  Malaysian: "my",
  Mexican: "mx",
  Moroccan: "ma",
  Polish: "pl",
  Portuguese: "pt",
  Russian: "ru",
  Spanish: "es",
  Thai: "th",
  Tunisian: "tn",
  Turkish: "tr",
  Ukrainian: "ua",
  Uruguayan: "uy",
  Vietnamese: "vn"
};

export default function MealCard({ meal }) {
  const { favorites, toggleFavorite } = useFavorites();

  const saved = favorites.some(
    item => String(item.id) === String(meal.id)
  );

  const countryCode = countryCodes[meal.area];

  return (
    <article className="ff-meal-card">
      <div className="ff-meal-image-wrap">
        <Link
          to={`/meal/${meal.id}`}
          className="ff-meal-image-link"
          aria-label={`ดูรายละเอียด ${meal.name}`}
        >
          {meal.image ? (
            <img
              className="ff-meal-image"
              src={meal.image}
              alt={meal.name}
              loading="lazy"
            />
          ) : (
            <div className="ff-meal-placeholder">
              Foodie Finder
            </div>
          )}
        </Link>

        <Link
          to={`/meal/${meal.id}`}
          className="ff-image-arrow"
          aria-label={`ดู ${meal.name}`}
        >
          <ArrowUpRight size={18} />
        </Link>

        <button
          type="button"
          className={`ff-heart-button ${saved ? "is-saved" : ""}`}
          onClick={() => toggleFavorite(meal)}
          aria-label={
            saved ? "นำออกจากรายการโปรด" : "บันทึกรายการโปรด"
          }
          title={saved ? "นำออกจากรายการโปรด" : "เพิ่มรายการโปรด"}
        >
          <Heart
            size={19}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="ff-meal-content">
        <div className="ff-meal-meta">
          <span className="ff-meal-country">
            {countryCode ? (
              <img
                className="ff-country-flag"
                src={`https://flagcdn.com/w80/${countryCode}.png`}
                alt={`${meal.area} flag`}
                loading="lazy"
              />
            ) : (
              <span className="ff-country-flag-placeholder">
                🌎
              </span>
            )}

            <span>{meal.area || "World"}</span>
          </span>

          <span className="ff-meta-divider"></span>

          <span className="ff-meal-category">
            {meal.category || "Meal"}
          </span>
        </div>

        <Link
          to={`/meal/${meal.id}`}
          className="ff-meal-title"
          title={meal.name}
        >
          {meal.name}
        </Link>

        <div className="ff-meal-footer">
          <span>DISCOVER SOMETHING DELICIOUS</span>
          <span className="ff-footer-sparkle">✧</span>
        </div>
      </div>
    </article>
  );
}
