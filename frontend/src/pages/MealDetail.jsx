import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { fetchMeal } from "../api";
import { useFavorites } from "../context";
import { ErrorState, LoadingState } from "../components/States";

export default function MealDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const { favorites, toggleFavorite } = useFavorites();
  const saved = favorites.some(item => String(item.id) === String(id));
  const load = async () => {
    setStatus("loading");
    try { const result = await fetchMeal(id); setMeal(result.data); setStatus("success"); }
    catch (e) { setError(e.message); setStatus("error"); }
  };
  useEffect(() => { load(); }, [id]);
  if (status === "loading") return <div className="page-wrap"><LoadingState label="กำลังโหลดสูตรอาหาร..."/></div>;
  if (status === "error") return <div className="page-wrap"><ErrorState message={error} onRetry={load}/></div>;
  return <div className="page-wrap detail-page">
    <Link to="/explore" className="back-link"><ArrowLeft size={16}/> Back to explore</Link>
    <div className="detail-layout"><div><img className="detail-image" src={meal.image} alt={meal.name}/></div><div className="detail-copy"><span className="eyebrow">{meal.area} · {meal.category}</span><h1>{meal.name}</h1><p className="detail-lead">A little inspiration for your next meal.</p><button className={`button ${saved ? "button-soft" : "button-dark"}`} onClick={() => toggleFavorite(meal)}><Heart size={16} fill={saved ? "currentColor" : "none"}/>{saved ? "Saved to favorites" : "Save to favorites"}</button><h3>Ingredients</h3><ul className="ingredient-list">{meal.ingredients?.map((item, i) => <li key={i}><span>{item.name}</span><small>{item.measure}</small></li>)}</ul>{meal.youtube && <a className="text-link" href={meal.youtube} target="_blank" rel="noreferrer">Watch on YouTube <ExternalLink size={14}/></a>}</div></div>
    <section className="instructions-section"><span className="eyebrow">LET'S GET COOKING</span><h2>Instructions</h2><p>{meal.instructions || "No instructions available."}</p></section>
  </div>;
}
