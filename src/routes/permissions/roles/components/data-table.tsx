import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useRoles } from "@/api/roles";
import { DataTableToolbar } from "@/routes/permissions/roles/components/data-table-toolbar";
import { DataTablePagination } from "@/routes/permissions/roles/components/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RoleForm from "@/routes/permissions/roles/components/role-form";
import DeleteModal from "@/routes/permissions/roles/components/delete-modal";
import { useRolesStore } from "@/routes/permissions/roles/data/store";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { editOpened, setEditOpened, deleteOpened, setDeleteOpened } =
    useRolesStore(
      useShallow((state) => ({
        editOpened: state.isEditOpen,
        setEditOpened: state.setIsEditOpen,
        deleteOpened: state.isDeleteOpen,
        setDeleteOpened: state.setIsDeleteOpen,
      })),
    );

  const { data } = useRoles();

  const table = useReactTable({
    data: data as TData[],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  
  useEffect(() => {
    if (!editOpened) {
      console.log("remove pointer events");
      document.body.style.removeProperty("pointer-events");
    }
  }, [editOpened]);

  useEffect(() => {
    if (!deleteOpened) {
      document.body.style.removeProperty("pointer-events");
    }
  }, [deleteOpened]);

  return (
    <>
      <div className="flex flex-1 flex-col justify-between gap-y-4">
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
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
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
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
                      className="h-[65px] text-center"
                    >
                      Nenhum resultado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DataTablePagination table={table} />
      </div>

      <RoleForm opened={editOpened} setOpened={setEditOpened} />

      <DeleteModal opened={deleteOpened} setOpened={setDeleteOpened} />
    </>
  );
}
