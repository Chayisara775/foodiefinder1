import { createContext, useContext, useMemo, useState } from "react";

const FavoritesContext = createContext(null);
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("foodie-finder-favorites") || "[]"); }
    catch { return []; }
  });
  const toggleFavorite = meal => {
    setFavorites(current => {
      const exists = current.some(item => String(item.id) === String(meal.id));
      const next = exists ? current.filter(item => String(item.id) !== String(meal.id)) : [...current, meal];
      localStorage.setItem("foodie-finder-favorites", JSON.stringify(next));
      return next;
    });
  };
  const value = useMemo(() => ({ favorites, toggleFavorite }), [favorites]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
export const useFavorites = () => useContext(FavoritesContext);
