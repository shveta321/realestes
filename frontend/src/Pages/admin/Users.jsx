import { useEffect, useState } from "react";
import DataTable from "../../components/Admin/Datatable";
import Swal from "sweetalert2";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/userss", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (Array.isArray(data)) setUsers(data);
    else if (Array.isArray(data.users)) setUsers(data.users);
    else setUsers([]);
  };

  // DELETE USER
 
const handleDelete = async (row) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel"
  }).then(async (result) => {
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/admin/userss/${row.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      Swal.fire({
        title: "Deleted!",
        text: data.msg,
        icon: "success"
      });

      fetchUsers();
    }
  });
};

  // UPDATE USER
  const updateUser = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/admin/userss/${editUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editUser)
    });

    const data = await res.json();
    alert(data.msg);

    setEditUser(null);
    fetchUsers();
  };

  const columns = [
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role" },
    { label: "Created At", field: "created_at" }
  ];

  const actions = [
    { label: " ✏️", onClick: (row) => setEditUser(row) },
    { label: "🗑️", onClick: handleDelete }
  ];

  return (
    <>
      <DataTable
        title="Users"
        columns={columns}
        data={Array.isArray(users) ? users : []}
        actions={actions}
      />

      {/* EDIT MODAL */}
      {editUser && (
        <div className="modal-bg">
          <div className="modal-content">
            <h3>Edit User</h3>

            <input
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              placeholder="Email"
            />

            <select
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
            >
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="investor">Investor</option>
            </select>

            <button onClick={updateUser}>Update</button>
            <button onClick={() => setEditUser(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
