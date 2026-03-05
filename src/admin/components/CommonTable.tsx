import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
}

function CommonTable<T extends { id: number | string }>({
  columns,
  data,
  loading = false,
}: CommonTableProps<T>) {
  return (
    <div className="w-full">

      {/* Desktop Table (તમારો existing code same) */}
      <div className="hidden md:grid grid-cols-12">
        <div className="col-span-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max whitespace-nowrap text-left border-collapse">
              <thead className="bg-[#1B263B]">
                <tr>
                  {columns.map((col, i) => (
                    <th key={i} className="thead-th-dark">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-[#1f2a40] transition-colors bg-[#16233A] border-b border-[#24324D]"
                    >
                      {columns.map((col, i) => (
                        <td key={i} className="tbody-tr-dark">
                          {typeof col.accessor === "function"
                            ? col.accessor(row)
                            : (row[col.accessor] as React.ReactNode)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-400">No data found</p>
        ) : (
          data.map((row) => (
            <div
              key={row.id}
              className="bg-[#16233A] border border-[#24324D] rounded-lg p-4 space-y-2"
            >
              {columns.map((col, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <span className="text-gray-400 text-sm">{col.header}</span>

                  <span className="text-white text-sm text-right">
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode)}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default CommonTable;