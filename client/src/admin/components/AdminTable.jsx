/**
 * Admin data table with optional pagination wrapper.
 * Location: client/src/admin/components/AdminTable.jsx
 */
import AdminPagination from './AdminPagination';
import AdminTableToolbar from './AdminTableToolbar';

const AdminTable = ({
  columns,
  rows,
  rowKey = 'id',
  emptyMessage = 'No records found.',
  toolbar,
  pagination,
}) => {
  const displayRows = pagination ? pagination.pageRows : rows;

  return (
    <div className="admin-table-panel">
      {toolbar && (
        <AdminTableToolbar
          search={toolbar.search}
          onSearchChange={toolbar.setSearch}
          searchPlaceholder={toolbar.searchPlaceholder}
          statusFilter={toolbar.statusFilter}
          onStatusFilterChange={toolbar.setStatusFilter}
          statusOptions={toolbar.statusOptions}
          dateFrom={toolbar.dateFrom}
          dateTo={toolbar.dateTo}
          onDateFromChange={toolbar.setDateFrom}
          onDateToChange={toolbar.setDateTo}
          sortKey={toolbar.sortKey}
          sortDir={toolbar.sortDir}
          sortOptions={toolbar.sortOptions}
          onSortChange={toolbar.setSort}
        />
      )}

      {!displayRows?.length ? (
        <div className="admin-empty">{emptyMessage}</div>
      ) : (
        <div className="table-responsive admin-table-wrap">
          <table className="table admin-table mb-0">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} scope="col">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
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
      )}

      {pagination && pagination.total > 0 && (
        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          rangeStart={pagination.rangeStart}
          rangeEnd={pagination.rangeEnd}
          total={pagination.total}
          onPageChange={pagination.setPage}
          onPrev={pagination.prevPage}
          onNext={pagination.nextPage}
        />
      )}
    </div>
  );
};

export default AdminTable;
