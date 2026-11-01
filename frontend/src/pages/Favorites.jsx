
import { useFavorites } from "../context";
import MealGrid from "../components/MealGrid";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main className="page-wrap">
      <section className="page-intro">
        <span className="eyebrow">YOUR COLLECTION</span>
        <h1>My Favorites ♡</h1>
        <p>เมนูอาหารที่คุณบันทึกไว้</p>
      </section>

      <section className="results-section">
        <div className="results-heading">
          <h2>เมนูโปรดของฉัน</h2>
          <span>{favorites.length} เมนู</span>
        </div>

        <MealGrid meals={favorites} />
      </section>
    </main>
  );
}

