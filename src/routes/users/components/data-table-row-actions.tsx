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
import { type UsersRow, useUsersStore } from "@/routes/users/data/store";
import { useShallow } from "zustand/react/shallow";
import { useActivateUser, useAssignRoleToUser, useInviteUserByEmail } from "@/api/users";
import {
  KeyboardNavigation,
  onKeyboardPress,
} from "@/lib/utils/keyboard-navigation";
import { toast } from "sonner";
import { roles } from "@/routes/users/data/data";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);
  const { setRow, setIsEditOpen, setIsDeleteOpen, setIsDisableOpen } =
    useUsersStore(
      useShallow((state) => ({
        setRow: state.setRow,
        setIsEditOpen: state.setIsEditOpen,
        setIsDeleteOpen: state.setIsDeleteOpen,
        setIsDisableOpen: state.setIsDisableOpen,
      })),
    );

  const { mutate } = useAssignRoleToUser();

  const handleDelete = useCallback(() => {
    setRow(row.original as UsersRow);
    setIsDeleteOpen(true);
  }, [row.original, setIsDeleteOpen, setRow]);

  const handleDisable = useCallback(() => {
    setRow(row.original as UsersRow);
    setIsDisableOpen(true);
  }, [row.original, setIsDisableOpen, setRow]);

  const handleEdit = useCallback(() => {
    setRow(row.original as UsersRow);
    setIsEditOpen(true);
  }, [row.original, setIsEditOpen, setRow]);

  const { mutate: activate } = useActivateUser({
    onSuccess: () => {
      toast.success(`Usuário ativado com sucesso!`);
    },
  });

  const { mutate: invite } = useInviteUserByEmail({
    onSuccess: () => {
      toast.success(`Link de acesso enviado com sucesso!`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (open) {
      const handleKeyUp = (event: KeyboardEvent) =>
        onKeyboardPress(
          KeyboardNavigation.Enter,
          () => event.ctrlKey && handleEdit(),
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
          () => event.ctrlKey && handleDisable(),
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
          () => event.ctrlKey && handleDelete(),
        )(event as unknown as React.KeyboardEvent<Document>);

      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [handleDelete, open]);

  const handleInvite = useCallback(() => {
    invite({ email: (row.original as UsersRow)!.email! });
  }, [invite, row.original]);

  return (
    <>
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
          <DropdownMenuItem onClick={handleEdit}>
            Editar
            <DropdownMenuShortcut>⌘↵</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Papel</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {roles.map((role) => {
                return (
                  <DropdownMenuItem
                    key={role.value}
                    onClick={() => {
                      mutate({
                        roleId: Number(role.value!),
                        userId: (row.original as UsersRow)!.id!,
                      });
                    }}
                  >
                    <role.icon className="text-muted-foreground" />
                    {role.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleInvite}>
            Enviar link de acesso
          </DropdownMenuItem>

          {!(row.original as UsersRow)?.bannedUntil && (
            <DropdownMenuItem onClick={handleDisable}>
              Desativar
              <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {(row.original as UsersRow)?.bannedUntil && (
            <DropdownMenuItem
              onClick={() => activate({ id: (row.original as UsersRow)!.id! })}
            >
              Ativar
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleDelete}>
            Deletar
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
