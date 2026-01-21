import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/properties">Properties</Link></li>
        <li><Link to="/admin/inquiries">Inquiries</Link></li>
      </ul>
    </div>
  );
}
