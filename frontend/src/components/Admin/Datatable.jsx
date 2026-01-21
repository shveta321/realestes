import { useState } from "react";

export default function DataTable({ title, columns, data, actions = [] }) {
  const [search, setSearch] = useState("");

  const filtered = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="datatable-container">
      <div className="datatable-header">
        <h2>{title}</h2>
        <input
          className="datatable-search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="datatable-table">
        <thead>
          <tr>
            {columns.map(col => <th key={col.field}>{col.label}</th>)}
            {actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {filtered.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.field}>{row[col.field]}</td>
              ))}

              {actions.length > 0 && (
                <td>
                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => action.onClick(row)}
                      className="datatable-btn"
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
