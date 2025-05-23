import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, { useCallback, useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import {
  type ShipmentsRow,
  useShipmentsStore,
} from "@/routes/shipments/data/store";
import { useShallow } from "zustand/react/shallow";
import { useUpdateShipment } from "@/api/shipments";
import {
  KeyboardNavigation,
  onKeyboardPress,
} from "@/lib/utils/keyboard-navigation";
import {
  clearFieldsBasedOnStatus,
  status,
  statusOrder,
} from "@/routes/shipments/data/data";
import { selectShipmentSchema } from "@/schemas/shipments";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);
  const { setRow, setIsEditOpen, setIsDeleteOpen, setIsDisableOpen } =
    useShipmentsStore(
      useShallow((state) => ({
        setRow: state.setRow,
        setIsEditOpen: state.setIsEditOpen,
        setIsDeleteOpen: state.setIsDeleteOpen,
        setIsDisableOpen: state.setIsDisableOpen,
      }))
    );

  const { mutate } = useUpdateShipment();

  const handleDelete = useCallback(() => {
    setRow(row.original as ShipmentsRow);
    setIsDeleteOpen(true);
  }, [row.original, setIsDeleteOpen, setRow]);

  const handleDisable = useCallback(() => {
    setRow(row.original as ShipmentsRow);
    setIsDisableOpen(true);
  }, [row.original, setIsDisableOpen, setRow]);

  const handleEdit = useCallback(() => {
    setRow(row.original as ShipmentsRow);
    setIsEditOpen(true);
  }, [row.original, setIsEditOpen, setRow]);

  useEffect(() => {
    if (open) {
      const handleKeyUp = (event: KeyboardEvent) =>
        onKeyboardPress(
          KeyboardNavigation.Enter,
          () => event.ctrlKey && handleEdit()
        )(event as unknown as React.KeyboardEvent<Document>);

      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [handleEdit, open]);

  useEffect(() => {
    if (open) {
      const handleKeyUp = (event: KeyboardEvent) =>
        onKeyboardPress(
          ["x"],
          () => event.ctrlKey && handleDisable()
        )(event as unknown as React.KeyboardEvent<Document>);

      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [handleDisable, open]);

  useEffect(() => {
    if (open) {
      const handleKeyUp = (event: KeyboardEvent) =>
        onKeyboardPress(
          KeyboardNavigation.Backspace,
          () => event.ctrlKey && handleDelete()
        )(event as unknown as React.KeyboardEvent<Document>);

      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [handleDelete, open]);

  return (
    <div className="inline-flex items-center justify-end w-full">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {/*<DropdownMenuItem onClick={handleEdit}>*/}
          {/*  Edit*/}
          {/*  <DropdownMenuShortcut>⌘↵</DropdownMenuShortcut>*/}
          {/*</DropdownMenuItem>*/}

          {/*<DropdownMenuSeparator />*/}

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {status.map((stat) => {
                return (
                  <DropdownMenuItem
                    key={stat.value}
                    onClick={() => {
                      const updatedRow = {
                        ...row.original,
                        status: stat.value,
                        ...clearFieldsBasedOnStatus(stat.value),
                      };

                      const result = selectShipmentSchema.safeParse(updatedRow);

                      if (result.success) {
                        mutate(result.data);
                      } else {
                        console.error(
                          "Validation failed:",
                          result.error.errors
                        );
                      }
                    }}
                  >
                    <stat.icon className="text-muted-foreground" />
                    {stat.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/*<DropdownMenuSeparator />*/}

          {/*{!(row.original as ShipmentsRow)?.bannedUntil && (*/}
          {/*  <DropdownMenuItem onClick={handleDisable}>*/}
          {/*    Desativar*/}
          {/*    <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>*/}
          {/*  </DropdownMenuItem>*/}
          {/*)}*/}

          {/*{(row.original as ShipmentsRow)?.bannedUntil && (*/}
          {/*  <DropdownMenuItem*/}
          {/*    onClick={() =>*/}
          {/*      activate({ id: (row.original as ShipmentsRow)!.id! })*/}
          {/*    }*/}
          {/*  >*/}
          {/*    Ativar*/}
          {/*    <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>*/}
          {/*  </DropdownMenuItem>*/}
          {/*)}*/}

          {/*<DropdownMenuItem onClick={handleDelete}>*/}
          {/*  Deletar*/}
          {/*  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>*/}
          {/*</DropdownMenuItem>*/}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
