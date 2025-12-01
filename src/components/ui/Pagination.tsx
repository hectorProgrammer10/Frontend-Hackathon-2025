// Pagination Component

'use client';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalResults,
  resultsPerPage = 10,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-white/10 text-white
                 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed
                 transition-all duration-200"
      >
        Previous
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || page === currentPage}
            className={`px-4 py-2 rounded-lg transition-all duration-200
              ${page === currentPage
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold'
                : page === '...'
                  ? 'bg-transparent text-white cursor-default'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white/10 text-white
                 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed
                 transition-all duration-200"
      >
        Next
      </button>
    </div>
  );
}
