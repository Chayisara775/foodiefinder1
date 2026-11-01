
import MealCard from "./MealCard";

export default function MealGrid({ meals = [] }) {
  if (meals.length === 0) {
    return (
      <div className="meal-empty">
        <span className="meal-empty-icon">✧</span>
        <h3>ยังไม่พบเมนูอาหาร</h3>
        <p>ลองค้นหาด้วยชื่ออาหารหรือเลือกตัวกรองใหม่อีกครั้งนะ</p>
      </div>
    );
  }

  return (
    <div className="ff-meal-grid">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
