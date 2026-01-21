export default function Dashboard() {
  const role = localStorage.getItem("role");

  const label = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  return (
    <div>
      <h2>{label} Dashboard</h2>
      <p>Welcome to {label} panel!</p>
    </div>
  );
}
