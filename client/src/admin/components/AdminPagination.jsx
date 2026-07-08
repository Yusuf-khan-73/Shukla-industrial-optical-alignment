/**
 * Responsive admin table pagination.
 * Location: client/src/admin/components/AdminPagination.jsx
 */
const AdminPagination = ({
  page,
  totalPages,
  rangeStart,
  rangeEnd,
  total,
  onPageChange,
  onPrev,
  onNext,
}) => {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  startPage = Math.max(1, endPage - maxVisible + 1);

  for (let i = startPage; i <= endPage; i += 1) {
    pages.push(i);
  }

  return (
    <div className="admin-pagination">
      <p className="admin-pagination__info">
        Showing <strong>{rangeStart}-{rangeEnd}</strong> of <strong>{total}</strong>
      </p>
      <div className="admin-pagination__controls">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={onPrev}
          disabled={page <= 1}
        >
          Previous
        </button>
        <div className="admin-pagination__pages">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
