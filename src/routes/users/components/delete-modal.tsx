import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUsersStore } from "@/routes/users/data/store";
import { useDeactivateUser, useDeleteUser } from "@/api/users";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function DeleteModal() {
  const { row, isDisableOpen, isDeleteOpen, setIsClose } = useUsersStore(
    useShallow((state) => ({
      row: state.row,
      isDisableOpen: state.isDisableOpen,
      isDeleteOpen: state.isDeleteOpen,
      setIsClose: state.setIsClose,
    })),
  );
  
  const [confirmationText, setConfirmationText] = useState("");

  const label = isDisableOpen
    ? ["Desativar", "desativado"]
    : ["Deletar", "deletado"];
  
  const isAdmin = row?.roleName === "Administrador" || row?.roleId === 1;

  const { mutate: deactivateUser } = useDeactivateUser({
    onSuccess: () => {
      toast.success(
        `Usuário ${row?.email} ${label[1].toLowerCase()} com sucesso!`,
      );
      setConfirmationText("");
      setIsClose();
    },
  });

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => {
      toast.success(
        `Usuário ${row?.email} ${label[1].toLowerCase()} com sucesso!`,
      );
      setConfirmationText("");
      setIsClose();
    },
  });
  
  const handleClose = () => {
    setConfirmationText("");
    setIsClose();
  };

  return (
    <Dialog open={isDisableOpen || isDeleteOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            
            // Check confirmation text for delete action
            if (isDeleteOpen && confirmationText !== "DELETAR") {
              toast.error("Por favor, digite DELETAR para confirmar");
              return;
            }
            
            if (isDisableOpen) {
              deactivateUser({
                id: row!.id!,
              });
            } else {
              deleteUser({
                id: row!.id!,
              });
            }
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isDeleteOpen && isAdmin && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              {label[0]} o usuário {row?.email}?
            </DialogTitle>
            <DialogDescription className="space-y-2">
              {isDeleteOpen ? (
                <>
                  <p className="text-sm">
                    Esta ação irá desativar permanentemente este usuário. 
                    O usuário será marcado como inativo e não poderá mais acessar o sistema.
                  </p>
                  {isAdmin && (
                    <p className="text-sm font-semibold text-red-600">
                      ⚠️ ATENÇÃO: Este é um usuário ADMINISTRADOR. Certifique-se de que há outros administradores ativos no sistema.
                    </p>
                  )}
                  <div className="mt-4">
                    <label htmlFor="confirmation" className="text-sm font-medium">
                      Digite <span className="font-bold">DELETAR</span> para confirmar:
                    </label>
                    <input
                      id="confirmation"
                      type="text"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="DELETAR"
                      autoComplete="off"
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm">
                  Esta ação irá desativar temporariamente este usuário. 
                  O usuário poderá ser reativado posteriormente se necessário.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              variant={isDeleteOpen ? "destructive" : "default"}
              disabled={isDeleteOpen && confirmationText !== "DELETAR"}
            >
              {label[0]}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
