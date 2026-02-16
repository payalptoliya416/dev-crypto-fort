import React, { useMemo, useState } from "react";
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";
export interface Column<T> {
  header: string;
  key: keyof T;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface CommonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

function CommonTable<T>({
  data,
  columns,
  pageSizeOptions = [10, 20, 30, 50],
  defaultPageSize = 10,
}: CommonTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#3C3D47]">
        <table className="w-full text-left">
          <thead className="bg-[#285AD71F]">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`text-[#F4F4F5] text-sm px-5 py-[19px] font-normal ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className="border-t border-[#3C3D47] hover:bg-[#18233D] transition odd:bg-[#161F37] even:bg-[#202A43]"
              >
                {columns.map((col, i) => (
                  <td
                    key={i}
                    style={{ width: col.width }}
                    className={`py-[13px] px-5 ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {col.render ? col.render(row) : (row[col.key] as any)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden space-y-3">
        {paginatedData.map((row, index) => (
          <div
            key={index}
            className="border border-[#3C3D47] p-4 bg-[#161F37]"
          >
            {columns.map((col, i) => (
              <div key={i} className="flex justify-between mt-2">
                <p className="text-[#7A7D83] text-sm">{col.header}</p>
                <div className="text-white text-sm font-medium">
                  {col.render ? col.render(row) : (row[col.key] as any)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 px-4 py-3 border border-t-0 border-[#3C3D47] rounded-b-xl bg-[#161F37]">
          {/* Left info */}
          <p className="text-sm text-[#7A7D83]">
            {from} – {to} of {totalItems} results
          </p>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Page size */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#161F37] border border-[#3C3D47] text-white text-sm rounded px-2 py-1"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-1 sm:p-2 text-white disabled:opacity-40 cursor-pointer"
                  >
                    <FiChevronsLeft size={18} />
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 sm:p-2 text-white disabled:opacity-40 cursor-pointer"
                  >
                    <FiChevronLeft size={18} />
                  </button>

                  <span className="text-sm text-white px-2">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 sm:p-2 text-white disabled:opacity-40 cursor-pointer"
                  >
                    <FiChevronRight size={18} />
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1 sm:p-2 text-white disabled:opacity-40 cursor-pointer"
                  >
                    <FiChevronsRight size={18} />
                  </button>
                </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommonTable;
