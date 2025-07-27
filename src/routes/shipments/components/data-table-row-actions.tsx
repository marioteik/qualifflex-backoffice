import { Row, Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, { useCallback, useEffect, useState } from "react";
import { EllipsisVertical, EyeIcon, MessageSquareWarning } from "lucide-react";
import {
  type ShipmentsRow,
  useShipmentsStore,
} from "@/routes/shipments/data/store";
import { useShallow } from "zustand/react/shallow";
import { useUpdateShipmentStatus } from "@/api/shipments";
import {
  KeyboardNavigation,
  onKeyboardPress,
} from "@/lib/utils/keyboard-navigation";
import { status } from "@/routes/shipments/data/data";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { updateStatusShipmentSchema } from "@/schemas/shipments";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  detailPath?: string;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);

  const {
    setRow,
    setIsEditOpen,
    setIsDeleteOpen,
    setIsDisableOpen,
    setIsDetailModalOpen,
    setSelectedShipmentId,
  } = useShipmentsStore(
    useShallow((state) => ({
      setRow: state.setRow,
      setIsEditOpen: state.setIsEditOpen,
      setIsDeleteOpen: state.setIsDeleteOpen,
      setIsDisableOpen: state.setIsDisableOpen,
      setIsDetailModalOpen: state.setIsDetailModalOpen,
      setSelectedShipmentId: state.setSelectedShipmentId,
    }))
  );

  const { mutate } = useUpdateShipmentStatus();

  const handleOpenDetail = useCallback(() => {
    const shipmentId = (row.original as { id: string }).id;

    // Set the shipment ID and open modal
    setSelectedShipmentId(shipmentId);
    setIsDetailModalOpen(true);

    // Update URL with search parameter to support deep linking
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("shipmentId", shipmentId);
    navigate(`${location.pathname}?${currentUrl.searchParams.toString()}`, {
      replace: true,
    });
  }, [
    row.original,
    setSelectedShipmentId,
    setIsDetailModalOpen,
    navigate,
    location.pathname,
  ]);

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
    <div className="inline-flex items-center justify-end w-full gap-2">
      <Button
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        onClick={handleOpenDetail}
      >
        <EyeIcon className="h-4 w-4" />
        <span className="sr-only">Ver detalhes</span>
      </Button>

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
              {status
                .filter(
                  (stat) =>
                    stat.value !== "Produção parcial" &&
                    stat.value !== "Pendente aprovação"
                )
                .map((stat) => {
                  return (
                    <DropdownMenuItem
                      key={stat.value}
                      onClick={() => {
                        toast.custom(
                          (id) => (
                            <Card className="w-full max-w-[364px]">
                              <CardHeader>
                                <CardTitle className="text-lg font-medium flex items-center gap-2">
                                  <MessageSquareWarning className="size-20 text-destructive" />
                                  Deseja alterar o status da remessa para{" "}
                                  {stat.label}
                                </CardTitle>
                              </CardHeader>

                              <CardContent className="text-base">
                                Essa ação não pode ser desfeita.
                              </CardContent>

                              <CardFooter className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  color="secondary"
                                  onClick={() => {
                                    toast.dismiss(id);
                                  }}
                                >
                                  Cancelar
                                </Button>

                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    const updatedRow = {
                                      id: (row.original as ShipmentsRow).id,
                                      status: stat.value,
                                    };

                                    const result =
                                      updateStatusShipmentSchema.safeParse(
                                        updatedRow
                                      );

                                    if (result.success) {
                                      mutate(result.data, {
                                        onSuccess: () => {
                                          toast.dismiss(id);
                                          table.resetRowSelection();
                                        },
                                      });
                                    } else {
                                      console.error(
                                        "Validation failed:",
                                        result.error.errors
                                      );
                                    }
                                  }}
                                >
                                  Confirmar
                                </Button>
                              </CardFooter>
                            </Card>
                          ),
                          {
                            position: "top-center",
                            dismissible: false,
                          }
                        );
                      }}
                    >
                      <stat.icon className="text-muted-foreground" />
                      {stat.label}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {!(row.original as ShipmentsRow)?.confirmedAt &&
            (row.original as ShipmentsRow)?.informedEstimation && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    toast.custom(
                      (id) => (
                        <Card className="w-full max-w-[364px]">
                          <CardHeader>
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                              <MessageSquareWarning className="size-20 text-destructive" />
                              Deseja confirmar o prazo negociado da remessa?
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="text-base">
                            Essa ação não pode ser desfeita e vai alterar o
                            prazo da remessa para o prazo informado pela
                            costureira.
                          </CardContent>

                          <CardFooter className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              color="secondary"
                              onClick={() => {
                                toast.dismiss(id);
                              }}
                            >
                              Cancelar
                            </Button>

                            <Button
                              variant="secondary"
                              onClick={() => {
                                const updatedRow = {
                                  id: (row.original as ShipmentsRow).id,
                                  status: "Confirmado",
                                  informedEstimation: (
                                    row.original as ShipmentsRow
                                  ).informedEstimation,
                                  systemEstimation: (
                                    row.original as ShipmentsRow
                                  ).systemEstimation,
                                };

                                const result =
                                  updateStatusShipmentSchema.safeParse(
                                    updatedRow
                                  );

                                if (result.success) {
                                  mutate(result.data, {
                                    onSuccess: () => {
                                      toast.dismiss(id);
                                      table.resetRowSelection();
                                    },
                                  });
                                } else {
                                  console.error(
                                    "Validation failed:",
                                    result.error.errors
                                  );
                                }
                              }}
                            >
                              Confirmar
                            </Button>
                          </CardFooter>
                        </Card>
                      ),
                      {
                        position: "top-center",
                        dismissible: false,
                      }
                    );
                  }}
                >
                  Aprovar
                </DropdownMenuItem>
              </>
            )}

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
