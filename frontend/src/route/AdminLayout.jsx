import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

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
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("adminTheme") === "dark"
  );
  const [open, setOpen] = useState(false);

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
    { label: "Add properties", icon: <FiMail />, path: "/admin/Admproperties" },
    { label: "Advisory", icon: <FiMail />, path: "/admin/Advideoadviservices" },
    { label: "Contact", icon: <FiMail />, path: "/admin/Admincontact" }


  ];

  // const logout = () => {
  //   localStorage.clear();
  //   window.location.href = "/loging";
  // };
  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };
  return (
    <div className="admin-container">
      <aside className={`sidebar ${open ? "show" : ""}`}>
        <h2 className="sidebar-title">Admin Panel</h2>

        <ul className="menu-list">
          {menu.map((item, i) => (
            <li
              key={i}
              className={`menu-item ${location.pathname === item.path ? "active" : ""
                }`}onClick={() => setOpen(false)} 
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
          <button className="hamburger" onClick={() => setOpen(!open)}>
            <FiMenu />
          </button>
          <span className="title">Welcome Admin</span>

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
