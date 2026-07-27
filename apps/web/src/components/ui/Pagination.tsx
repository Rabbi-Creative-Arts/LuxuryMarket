interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="rounded-lg border px-3 py-2 disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={`rounded-lg px-4 py-2 transition ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "border hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="rounded-lg border px-3 py-2 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}