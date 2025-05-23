import * as React from "react";
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
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShallow } from "zustand/react/shallow";
import { DataTablePagination } from "@/components/atoms/data-table-pagination";
import { useShipments } from "@/api/shipments";
import { useLoadListStore } from "../data/store";
import { columns } from "./columns";
import { useRoutes } from "@/api/routes";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function DataTable() {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
  } = useLoadListStore(
    useShallow((state) => ({
      rowSelection: state.rowSelection,
      setRowSelection: state.setRowSelection,
      pagination: state.pagination,
      setPagination: state.setPagination,
      sorting: state.sorting,
      setSorting: state.setSorting,
      columnFilters: state.columnFilters,
      setColumnFilters: state.setColumnFilters,
      columnVisibility: state.columnVisibility,
      setColumnVisibility: state.setColumnVisibility,
      isEditOpen: state.isEditOpen,
      isDeleteOpen: state.isDeleteOpen,
      isDisableOpen: state.isDisableOpen,
    })),
  );

  const { data: shipments, isPending } = useShipments();
  const { data: driverRoutes } = useRoutes();

  const data = useMemo(() => {
    if (!shipments?.length || !driverRoutes?.length) return [];

    const allRoutes = driverRoutes.flatMap((driverItem) =>
      driverItem.routes.map((r) => ({
        ...r,
        driver: driverItem.driver,
      })),
    );

    return shipments
      .map((shipment) => {
        const matchingRoute = allRoutes.find(
          (route) => route.shipmentId === shipment.id,
        );

        return {
          ...shipment,
          route: matchingRoute,
          driver: matchingRoute?.driver?.name ?? null,
        };
      })
      .filter((shipment) => !shipment.route?.endTime);
  }, [shipments, driverRoutes]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        row.original?.route?.startTime && "bg-success/20",
                      )}
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
                      {isPending ? "Carregando resultados" : "Nenhum resultado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DataTablePagination compact table={table} />
      </div>
    </>
  );
}
