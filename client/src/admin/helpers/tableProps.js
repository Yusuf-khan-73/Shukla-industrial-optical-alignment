/**
 * Shared props builder for AdminTable toolbar + pagination.
 * Location: client/src/admin/helpers/tableProps.js
 */
export const buildTableProps = (table, {
  searchPlaceholder = 'Search…',
  statusOptions = [
    { value: 'all', label: 'All status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  sortOptions = [
    { key: 'id', dir: 'desc', label: 'Newest first' },
    { key: 'id', dir: 'asc', label: 'Oldest first' },
    { key: 'title', dir: 'asc', label: 'Title A–Z' },
  ],
} = {}) => ({
  pagination: table,
  toolbar: {
    search: table.search,
    setSearch: table.setSearch,
    searchPlaceholder,
    statusFilter: table.statusFilter,
    setStatusFilter: table.setStatusFilter,
    statusOptions,
    dateFrom: table.dateFrom,
    dateTo: table.dateTo,
    setDateFrom: table.setDateFrom,
    setDateTo: table.setDateTo,
    sortKey: table.sortKey,
    sortDir: table.sortDir,
    setSort: table.setSort,
    sortOptions,
  },
});
