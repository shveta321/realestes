import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiHome,
  FiMail,
  FiLogOut,
  FiMoon,
  FiSun
} from "react-icons/fi";
import { useEffect, useState } from "react";
import "../App.css";

export default function AdminLayout() {
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("adminTheme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("adminTheme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("adminTheme", "light");
    }
  }, [darkMode]);

  const menu = [
    { label: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
    { label: "Users", icon: <FiUsers />, path: "/admin/users" },
    { label: "Inquiries", icon: <FiMail />, path: "/admin/Inquiries" },
    { label: "Investors", icon: <FiMail />, path: "/admin/Investorprop" },
    { label: "Admproperties", icon: <FiMail />, path: "/admin/Admproperties" }
  ];

  const logout = () => {
    localStorage.clear();
    window.location.href = "/loging";
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <ul className="menu-list">
          {menu.map((item, i) => (
            <li
              key={i}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={logout}>
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-area">
        <nav className="top-nav">
          <span className="title">Welcome Admin</span>

          {/* 🌙 Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </nav>

        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
