import { Link, Outlet, useLocation } from "react-router-dom";
import { FiUsers, FiHome, FiFileText, FiMail, FiLogOut } from "react-icons/fi";
import "../App.css";
export default function AdminLayout() {
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
    { label: "Users", icon: <FiUsers />, path: "/admin/users" },
    { label: "Properties", icon: <FiFileText />, path: "/admin/properties" },
    { label: "Inquiries", icon: <FiMail />, path: "/admin/inquiries" },
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
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={logout}>
          <FiLogOut />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-area">
        {/* Navbar */}
        <nav className="top-nav">
          <span className="title">Welcome Admin</span>
          <div className="profile">
            <img src="https://via.placeholder.com/" alt="profile" />
          </div>
        </nav>

        {/* Page Content */}
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
