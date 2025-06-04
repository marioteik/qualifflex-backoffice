import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  compact?: boolean;
}

export function DataTablePagination<TData>({
  table,
  compact = false,
}: DataTablePaginationProps<TData>) {
  const canSelectRows = !compact && !!table.getColumn("select");

  return (
    <div className="flex items-center justify-between w-full px-2">
      {canSelectRows ? (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} itens(s) selecionados.
        </div>
      ) : (
        <div />
      )}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {!compact && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Itens por página</p>

            <Select
              value={
                table.getState().pagination.pageSize ===
                table.getCoreRowModel().rows.length
                  ? "Infinity"
                  : `${table.getState().pagination.pageSize}`
              }
              onValueChange={(value) => {
                if (value === "Infinity") {
                  table.setPageSize(table.getCoreRowModel().rows.length); // Show all rows
                } else {
                  table.setPageSize(Number(value));
                }
              }}
            >
              <SelectTrigger className="h-8 w-[90px]">
                <SelectValue
                  placeholder={
                    table.getState().pagination.pageSize ===
                    table.getCoreRowModel().rows.length
                      ? "All"
                      : table.getState().pagination.pageSize
                  }
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50, 100, "Infinity"].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize === "Infinity" ? "Todos" : pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex min-w-[100px] items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para a primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para a página anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para a última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
