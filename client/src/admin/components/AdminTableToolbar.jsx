/**
 * Admin table toolbar — search, filters, sort.
 * Location: client/src/admin/components/AdminTableToolbar.jsx
 */
const AdminTableToolbar = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  sortKey,
  sortDir,
  sortOptions = [],
  onSortChange,
}) => (
  <div className="admin-table-toolbar">
    <div className="admin-table-toolbar__search">
      <i className="bi bi-search" aria-hidden="true" />
      <input
        type="search"
        className="form-control"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search table"
      />
    </div>

    {statusOptions?.length > 0 && (
      <select
        className="form-select admin-table-toolbar__select"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        aria-label="Filter by status"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    )}

    <input
      type="date"
      className="form-control admin-table-toolbar__date"
      value={dateFrom}
      onChange={(e) => onDateFromChange(e.target.value)}
      aria-label="Filter from date"
    />
    <input
      type="date"
      className="form-control admin-table-toolbar__date"
      value={dateTo}
      onChange={(e) => onDateToChange(e.target.value)}
      aria-label="Filter to date"
    />

    {sortOptions.length > 0 && (
      <select
        className="form-select admin-table-toolbar__select"
        value={`${sortKey}:${sortDir}`}
        onChange={(e) => {
          const [key, dir] = e.target.value.split(':');
          onSortChange(key, dir);
        }}
        aria-label="Sort table"
      >
        {sortOptions.map((opt) => (
          <option key={`${opt.key}:${opt.dir}`} value={`${opt.key}:${opt.dir}`}>
            {opt.label}
          </option>
        ))}
      </select>
    )}
  </div>
);

export default AdminTableToolbar;
