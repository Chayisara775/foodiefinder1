
import { NavLink, Outlet } from "react-router-dom";
import {
  Compass,
  Heart,
  House,
  UtensilsCrossed
} from "lucide-react";
import { useFavorites } from "../context";

export default function Layout() {
  const { favorites } = useFavorites();

  return (
    <div className="app-shell">

      <header className="navbar">
        <NavLink to="/" className="logo">
          <UtensilsCrossed size={23} />
          <span>FOODIE FINDER</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <House size={17} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <Compass size={17} />
            <span>Explore</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <Heart size={17} />
            <span>My Favorites</span>
            <span className="favorites-count">
              {favorites.length}
            </span>
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        FOODIE FINDER <span>·</span> Find something lovely to eat.
      </footer>

    </div>
  );
}
