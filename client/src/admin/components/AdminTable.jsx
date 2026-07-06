/**
 * Reusable admin data table.
 * Location: client/src/admin/components/AdminTable.jsx
 */
const AdminTable = ({ columns, rows, rowKey = 'id', emptyMessage = 'No records found.' }) => {
  if (!rows?.length) {
    return <div className="admin-empty">{emptyMessage}</div>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="table admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
