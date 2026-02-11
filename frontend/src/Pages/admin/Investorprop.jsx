import { useEffect, useState } from "react";
import DataTable from "../../components/Admin/Datatable";
import Swal from "sweetalert2";


export default function Investorprop() {
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/Investorss", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setInvestors(data);
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

  const res = await fetch(`http://localhost:5000/admin/investorss/${row.id}`, {
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
