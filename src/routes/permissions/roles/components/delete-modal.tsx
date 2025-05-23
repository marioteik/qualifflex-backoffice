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
import { useRolesStore } from "@/routes/permissions/roles/data/store";
import { useDeleteRole } from "@/api/roles";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";

export default function DeleteModal({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (isOpened: boolean) => void;
}) {
  const { setRow, setIsDeleteOpen, row } = useRolesStore(
    useShallow((state) => ({
      setRow: state.setRow,
      row: state.row,
      setIsDeleteOpen: state.setIsDeleteOpen,
    })),
  );

  const { mutate } = useDeleteRole({
    onSuccess: () => {
      toast.success(`Papel ${row?.role} deletado com sucesso!`);
      setRow(null);
      setIsDeleteOpen(false);
    },
  });

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogContent className="sm:max-w-[350px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            mutate(row!);
          }}
          className="space-y-8"
        >
          <DialogHeader>
            <DialogTitle>Delete o papel {row?.role} do sistema</DialogTitle>
            <DialogDescription>
              É possível deletar somente papéis que não possuem usuários
              adicionados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button type="submit">Deletar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
