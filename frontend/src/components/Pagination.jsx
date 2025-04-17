import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Create array of page numbers
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Get visible page numbers
  const getVisiblePageNumbers = () => {
    const MAX_VISIBLE = 5;
    
    if (totalPages <= MAX_VISIBLE) {
      return pageNumbers;
    }
    
    // Always show first page
    const result = [1];
    
    // Calculate the range around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust range to always show 3 pages when possible
    if (rangeEnd - rangeStart < 2 && totalPages > 4) {
      if (currentPage < totalPages / 2) {
        rangeEnd = Math.min(totalPages - 1, rangeStart + 2);
      } else {
        rangeStart = Math.max(2, rangeEnd - 2);
      }
    }
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      result.push("...");
    }
    
    // Add the range of pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      result.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      result.push("...");
    }
    
    // Always show last page
    if (totalPages > 1) {
      result.push(totalPages);
    }
    
    return result;
  };

  // Early return if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center">
      <ul className="flex space-x-1">
        {/* Previous page button */}
        <li>
          <button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-3 py-2 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700 dark:text-gray-500"
                : "text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
            aria-label="Previous page"
          >
            <FaAngleLeft />
          </button>
        </li>

        {/* Page numbers */}
        {getVisiblePageNumbers().map((pageNumber, index) => (
          <li key={index}>
            {pageNumber === "..." ? (
              <span className="flex items-center justify-center px-3 py-2 text-gray-500 dark:text-gray-400">
                ...
              </span>
            ) : (
              <button
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-2 rounded-md ${
                  currentPage === pageNumber
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                }`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            )}
          </li>
        ))}

        {/* Next page button */}
        <li>
          <button
            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-3 py-2 rounded-md ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700 dark:text-gray-500"
                : "text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
            aria-label="Next page"
          >
            <FaAngleRight />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination; 