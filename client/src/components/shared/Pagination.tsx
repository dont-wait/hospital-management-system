"use client";

import { memo } from "react";
import Icon from "@/components/shared/Icon";

type PaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
};

function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => {
          setCurrentPage(currentPage - 1);
        }}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg border
          transition-all duration-200
          ${
            currentPage === 1
              ? "border-gray-300 text-gray-400 cursor-not-allowed pointer-events-none"
              : "border-east-bay text-east-bay hover:bg-east-bay hover:text-white"
          }
        `}
        disabled={currentPage === 1}
      >
        <Icon name="ChevronLeft" className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-10 h-10 text-gray-500"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => {
              setCurrentPage(pageNum);
            }}
            className={`
              flex items-center justify-center w-10 h-10 rounded-lg border
              transition-all duration-200 font-medium
              ${
                isActive
                  ? "bg-east-bay text-white border-east-bay"
                  : "border-gray-300 text-gray-700 hover:border-east-bay hover:text-east-bay"
              }
            `}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => {
          setCurrentPage(currentPage + 1);
        }}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg border
          transition-all duration-200
          ${
            currentPage === totalPages
              ? "border-gray-300 text-gray-400 cursor-not-allowed pointer-events-none"
              : "border-east-bay text-east-bay hover:bg-east-bay hover:text-white"
          }
        `}
      >
        <Icon name="ChevronRight" className="w-5 h-5" />
      </button>
    </div>
  );
}

export default memo(Pagination);
