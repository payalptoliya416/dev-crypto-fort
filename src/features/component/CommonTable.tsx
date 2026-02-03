import React from "react";

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
}

function CommonTable<T>({ data, columns }: CommonTableProps<T>) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#3C3D47]">
        <table className="w-full text-left">
          {/* Header */}
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

          {/* Body */}
          <tbody>
            {data.map((row, index) => (
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
                    {/* Custom Render */}
                    {col.render ? col.render(row) : (row[col.key] as any)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-3">
        {data.map((row, index) => (
          <div
            key={index}
            className="border border-[#3C3D47] p-4 bg-[#161F37]"
          >
            {columns.map((col, i) => (
              <div
                key={i}
                className="flex justify-between items-center mt-2"
              >
                <p className="text-[#7A7D83] text-sm">{col.header}</p>

                <div className="text-white text-sm font-medium">
                  {col.render ? col.render(row) : (row[col.key] as any)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default CommonTable;
