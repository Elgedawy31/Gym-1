"use client";

import React from "react";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const pages: number[] = [];
  const maxButtons = 5;
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        aria-label="Previous page"
        className="px-3 py-1 rounded border disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
      >
        Prev
      </button>

      {start > 1 && (
        <>
          <button className={`px-3 py-1 rounded border`} onClick={() => goTo(1)}>1</button>
          {start > 2 && <span className="px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-1 rounded border ${p === currentPage ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => goTo(p)}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1">…</span>}
          <button className={`px-3 py-1 rounded border`} onClick={() => goTo(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        aria-label="Next page"
        className="px-3 py-1 rounded border disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}


