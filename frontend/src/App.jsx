
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { FavoritesProvider } from "./context";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Favorites from "./pages/Favorites";
import MealDetail from "./pages/MealDetail";

export default function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/meal/:id" element={<MealDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </FavoritesProvider>
  );
}
