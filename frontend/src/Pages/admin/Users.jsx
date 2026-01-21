import { useEffect, useState } from "react";
import DataTable from "../../components/Admin/Datatable";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setUsers(data);
  };

  const columns = [
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role" },
    { label: "Status", field: "status" },
    { label: "Created At", field: "created_at" },
  ];

  const actions = [
    { label: "Edit", onClick: (row) => console.log("Edit:", row) },
    { label: "Delete", onClick: (row) => console.log("Delete:", row) },
  ];

  return (
    <DataTable
      title="Users"
      columns={columns}
      data={users}
      actions={actions}
    />
  );
}
