import { Link, Outlet, useLocation } from "react-router-dom";
import { FiHome, FiMail, FiShoppingBag, FiLogOut } from "react-icons/fi";
import "../App.css";

export default function SellerLayout() {
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: <FiHome />, path: "/seller/SellerDashboard" },
     { label: "My Properties", icon: <FiShoppingBag />, path: "/seller/properties" },
    // { label: "Addproperty", icon: <FiFileText />, path: "/seller/Addproperty" },
    // { label: "Inquiries", icon: <FiMail />, path: "/seller/inquiries" },
        { label: "PropertyForm", icon: <FiMail />, path: "/seller/propertyForm" },

  ];

  const logout = () => {
    localStorage.clear();
    window.location.href = "/loging";
  };

  return (
    <div className="admin-container">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Seller Panel</h2>
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

      <div className="main-area">
        <nav className="top-nav">
          <span className="title">Welcome Seller</span>
          <div className="profile">
<img src="/default-profile.png" alt="profile" />
          </div>
        </nav>

        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
