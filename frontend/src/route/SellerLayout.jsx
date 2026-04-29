import { Link, Outlet, useLocation,useNavigate } from "react-router-dom";
import { FiHome, FiMail, FiShoppingBag, FiLogOut, FiMenu } from "react-icons/fi";
import { useState } from "react";
import "../App.css";

export default function SellerLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false); 
const navigate = useNavigate();

  const menu = [
        { label: "Property Form", icon: <FiMail />, path: "/seller/propertyForm" },
    { label: "My Properties", icon: <FiShoppingBag />, path: "/seller/properties" },
    { label: "Dashboard", icon: <FiHome />, path: "/seller/SellerDashboard" },
   
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
        <h2 className="sidebar-title">Seller Panel</h2>

        <ul className="menu-list">
          {menu.map((item, i) => (
            <li
              key={i}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => setOpen(false)} 
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

          <button className="hamburger" onClick={() => setOpen(!open)}>
            <FiMenu />
          </button>

          <span className="title">Welcome Seller</span>

          <div className="profile">
            {/* <img src="/default-profile.png" alt="profile" /> */}
          </div>
        </nav>

        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}