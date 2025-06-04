import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useOrdersStore } from "../data/store";
import { useShallow } from "zustand/react/shallow";
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
import { columns as defaultColumns } from "./columns";
import { useOrders } from "@/api/orders";

export default function OrdersTable() {
  const {
    row,
    setRow,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    pagination,
    setPagination,
  } = useOrdersStore(
    useShallow((state) => ({
      row: state.row,
      setRow: state.setRow,
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
    }))
  );

  const { data } = useOrders();

  // Build the table
  const table = useReactTable({
    data,
    columns: defaultColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: row,
      pagination,
    },
    autoResetPageIndex: false,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRow,

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
          <DataTableToolbar
            table={table}
            rowSelection={row}
            setRowSelection={setRow}
          />
          <div className="rounded-md border overflow-auto">
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
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => {
                    return (
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
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={defaultColumns.length}
                      className="h-[65px] text-center border-transparent dark:text-muted-foreground"
                    >
                      {data.length > 0
                        ? "Carregando resultados"
                        : "Nenhum resultado"}
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
