import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div>
      <div className="topbar">
        <div className="topbar-links">
          <Link to="/groups">squads</Link>
          <Link to="/users">find people</Link>
        </div>
        <button onClick={logout} className="btn logout-btn">
          log out
        </button>
      </div>
      <Outlet />
    </div>
  );
}
