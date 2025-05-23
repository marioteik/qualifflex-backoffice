import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUsersStore } from "@/routes/users/data/store";
import { useDeactivateUser, useDeleteUser } from "@/api/users";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";

export default function DeleteModal() {
  const { row, isDisableOpen, isDeleteOpen, setIsClose } = useUsersStore(
    useShallow((state) => ({
      row: state.row,
      isDisableOpen: state.isDisableOpen,
      isDeleteOpen: state.isDeleteOpen,
      setIsClose: state.setIsClose,
    })),
  );

  const label = isDisableOpen
    ? ["Desativar", "desativado"]
    : ["Deletar", "deletado"];

  const { mutate: deactivateUser } = useDeactivateUser({
    onSuccess: () => {
      toast.success(
        `Usuário ${row?.email} ${label[1].toLowerCase()} com sucesso!`,
      );
      setIsClose();
    },
  });

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => {
      toast.success(
        `Usuário ${row?.email} ${label[1].toLowerCase()} com sucesso!`,
      );
      setIsClose();
    },
  });

  return (
    <Dialog open={isDisableOpen || isDeleteOpen} onOpenChange={setIsClose}>
      <DialogContent className="sm:max-w-[350px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
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
          className="space-y-8"
        >
          <DialogHeader>
            <DialogTitle>
              {label[0]} o usuário {row?.email} do sistema?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button type="submit">{label[0]}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
