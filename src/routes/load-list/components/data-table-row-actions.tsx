import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useCallback, useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import {
  KeyboardNavigation,
  onKeyboardPress,
} from "@/lib/utils/keyboard-navigation";
import { type SelectRoute } from "@/schemas/routes";
import { useUpdateRoutes } from "@/api/routes";
import { useLoadListStore } from "@/routes/load-list/data/store";
import { clearFieldsBasedOnStatus, status } from "@/routes/shipments/data/data";
import { selectShipmentSchema } from "@/schemas/shipments";

interface DataTableRowActionsProps {
  row: Row<SelectRoute>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { setRow, setIsEditOpen, setIsDeleteOpen, setIsDisableOpen } =
    useLoadListStore(
      useShallow((state) => ({
        setRow: state.setRow,
        setIsEditOpen: state.setIsEditOpen,
        setIsDeleteOpen: state.setIsDeleteOpen,
        setIsDisableOpen: state.setIsDisableOpen,
      }))
    );

  const { mutate } = useUpdateRoutes();

  const handleDelete = useCallback(() => {
    setRow(row.original);
    setIsDeleteOpen(true);
  }, [row.original, setIsDeleteOpen, setRow]);

  const handleDisable = useCallback(() => {
    setRow(row.original);
    setIsDisableOpen(true);
  }, [row.original, setIsDisableOpen, setRow]);

  const handleEdit = useCallback(() => {
    setRow(row.original);
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
