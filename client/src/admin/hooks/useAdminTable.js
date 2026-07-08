/**
 * Admin table state — search, sort, filter, pagination (5 rows/page).
 * Location: client/src/admin/hooks/useAdminTable.js
 */
import { useMemo, useState } from 'react';

const PAGE_SIZE = 5;

const getNested = (obj, key) => {
  if (!key.includes('.')) return obj?.[key];
  return key.split('.').reduce((acc, part) => acc?.[part], obj);
};

export const useAdminTable = (rows = [], options = {}) => {
  const {
    searchKeys = [],
    dateKey = 'created_at',
    statusKey = 'is_active',
    defaultSortKey = 'id',
    defaultSortDir = 'desc',
  } = options;

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...(rows || [])];
    const q = search.trim().toLowerCase();

    if (q && searchKeys.length) {
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const val = getNested(row, key) ?? getNested(row, key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()));
          return String(val ?? '').toLowerCase().includes(q);
        })
      );
    }

    if (statusFilter !== 'all' && statusKey) {
      if (statusKey === 'is_read' || statusKey === 'isRead') {
        if (statusFilter === 'read') {
          result = result.filter((row) => Boolean(row.is_read ?? row.isRead));
        } else if (statusFilter === 'unread') {
          result = result.filter((row) => !(row.is_read ?? row.isRead));
        }
      } else {
        const active = statusFilter === 'active';
        result = result.filter((row) => {
          const val = row[statusKey] ?? row.isActive ?? row.is_active;
          return Boolean(val) === active;
        });
      }
    }

    if (dateFrom || dateTo) {
      result = result.filter((row) => {
        const raw = row[dateKey] ?? row.createdAt ?? row.completion_date ?? row.completionDate;
        if (!raw) return true;
        const d = new Date(raw);
        if (dateFrom && d < new Date(dateFrom)) return false;
        if (dateTo && d > new Date(`${dateTo}T23:59:59`)) return false;
        return true;
      });
    }

    result.sort((a, b) => {
      const av = getNested(a, sortKey) ?? getNested(a, sortKey.replace(/_([a-z])/g, (_, c) => c.toUpperCase())) ?? '';
      const bv = getNested(b, sortKey) ?? getNested(b, sortKey.replace(/_([a-z])/g, (_, c) => c.toUpperCase())) ?? '';
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rows, search, searchKeys, statusFilter, statusKey, dateFrom, dateTo, sortKey, sortDir, dateKey]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const setSort = (key, dir) => {
    setSortKey(key);
    setSortDir(dir);
    setPage(1);
  };

  return {
    pageRows,
    page: safePage,
    totalPages,
    total,
    pageSize: PAGE_SIZE,
    rangeStart: total ? start + 1 : 0,
    rangeEnd: Math.min(start + PAGE_SIZE, total),
    search,
    setSearch: (v) => { setSearch(v); setPage(1); },
    sortKey,
    sortDir,
    toggleSort,
    setSort,
    statusFilter,
    setStatusFilter: (v) => { setStatusFilter(v); setPage(1); },
    dateFrom,
    setDateFrom: (v) => { setDateFrom(v); setPage(1); },
    dateTo,
    setDateTo: (v) => { setDateTo(v); setPage(1); },
    setPage,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
  };
};

export default useAdminTable;
