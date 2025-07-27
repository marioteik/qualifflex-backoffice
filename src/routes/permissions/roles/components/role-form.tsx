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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { insertRoleSchema } from "@/schemas/roles";
import { useRolesStore } from "@/routes/permissions/roles/data/store";
import { useCreateRole, useUpdateRole } from "@/api/roles";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

export default function RoleForm({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (isOpenend: boolean) => void;
}) {
  const { row, setRow } = useRolesStore(
    useShallow((state) => ({
      row: state.row,
      setRow: state.setRow,
    }))
  );

  const form = useForm<z.infer<typeof insertRoleSchema>>({
    resolver: zodResolver(insertRoleSchema),
    defaultValues: {
      id: row?.id,
      role: row?.role ?? "",
    },
  });

  const { mutate: create } = useCreateRole({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(`Papel ${form.getValues().role} adicionado com sucesso!`);
      form.reset();
      setOpened(false);
      setRow(null);
    },
  });

  const { mutate: update } = useUpdateRole({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(`Papel ${form.getValues().role} alterado com sucesso!`);
      form.reset();
      setOpened(false);
      setRow(null);
    },
  });

  const shouldShowContent = opened;

  return (
    <Dialog open={shouldShowContent} onOpenChange={setOpened}>
      {shouldShowContent && (
        <DialogContent className="sm:max-w-[350px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                return row ? update({ ...row, ...values }) : create(values);
              })}
              className="space-y-8"
            >
              <DialogHeader>
                <DialogTitle>Papel</DialogTitle>
                <DialogDescription>
                  Adicione um novo papel ao sistema
                </DialogDescription>
              </DialogHeader>
              <div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do papel</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite um nome..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Fechar
                  </Button>
                </DialogClose>
                <Button type="submit">{row ? "Editar" : "Adicionar"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
