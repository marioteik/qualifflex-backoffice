import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";

import { useProductsStore } from "../data/store";
import { useShallow } from "zustand/react/shallow";
import { useProducts } from "@/api/products";
import { DataTablePagination } from "@/components/atoms/data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    pagination,
    setPagination,
  } = useProductsStore(
    useShallow((state) => ({
      sorting: state.sorting,
      setSorting: state.setSorting,
      columnFilters: state.columnFilters,
      setColumnFilters: state.setColumnFilters,
      columnVisibility: state.columnVisibility,
      setColumnVisibility: state.setColumnVisibility,
      pagination: state.pagination,
      setPagination: state.setPagination,
      isEditOpen: state.isEditOpen,
      isDeleteOpen: state.isDeleteOpen,
      isDisableOpen: state.isDisableOpen,
    })),
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Example usage of a products API hook:
  const { data, isLoading } = useProducts();

  const table = useReactTable({
    data: data ?? ([] as TData[]),
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    autoResetPageIndex: false,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="flex flex-1 flex-col justify-between gap-y-4">
        <div className="space-y-4">
          {/* Optional toolbar (filters, etc.) */}
          <DataTableToolbar
            table={table}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: `${cell.column.getSize()}px` }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[65px] text-center border-transparent dark:text-muted-foreground"
                    >
                      {isLoading ? "Carregando resultados" : "Nenhum resultado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DataTablePagination table={table} />
      </div>
    </>
  );
}
