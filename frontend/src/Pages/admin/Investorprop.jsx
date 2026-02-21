import { useEffect, useState } from "react";
import DataTable from "../../components/Admin/Datatable";
import Swal from "sweetalert2";


export default function Investorprop() {
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    fetchInvestors();
  }, []);

const fetchInvestors = async () => {
  try {
    const token = localStorage.getItem("token"); // JWT token

    const res = await fetch("http://synamc.com:5000/api/admin/investorss", {
      method: "GET", // GET request
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || "Failed to fetch investors");
    }

    const data = await res.json();
    console.log("Investors fetched:", data);
    setInvestors(data); // state me set karo

  } catch (err) {
    console.error("Error fetching investors:", err);
    alert(err.message);
  }
};


 const handleDelete = async (row) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Investor ID ${row.id} will be deleted!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  const token = localStorage.getItem("token");

  const res = await fetch(`http://synamc.com:5000/api/admin/investorss/${row.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  Swal.fire({
    title: "Deleted!",
    text: data.msg,
    icon: "success",
    timer: 2000
  });

  fetchInvestors();
};

  const columns = [
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Phone", field: "phone" },
    { label: "Requirement", field: "requirement" },
    { label: "Ticket Size", field: "ticket_size" },
    { label: "Created", field: "created_at" }
  ];

  const actions = [{ label: "Delete", onClick: handleDelete }];

  return (
    <DataTable
      title="Investors"
      columns={columns}
      data={investors}
      actions={actions}
    />
  );
}
