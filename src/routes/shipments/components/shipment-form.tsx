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
import { insertUser } from "@/schemas/auth";
import { useUsersStore } from "@/routes/users/data/store";
import { useCreateUser, useUpdateUser } from "@/api/users";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export default function ShipmentForm() {
  const { row, setIsClose, opened } = useUsersStore(
    useShallow((state) => ({
      row: state.row,
      setIsClose: state.setIsClose,
      opened: state.isEditOpen,
    }))
  );

  const form = useForm<z.infer<typeof insertUser>>({
    resolver: zodResolver(insertUser),
    defaultValues: {
      id: row?.id ?? "",
      email: row?.email ?? "",
    },
  });

  const { mutate: create } = useCreateUser({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(
        `Usuário ${form.getValues().email} adicionado com sucesso!`
      );
      form.reset();
      setIsClose();
    },
  });

  const { mutate: update } = useUpdateUser({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(`Usuário ${form.getValues().email} alterado com sucesso!`);
      form.reset();
      setIsClose();
    },
  });

  return (
    <Dialog open={opened} onOpenChange={setIsClose}>
      <DialogContent className="sm:max-w-[1000px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              return row ? update({ ...row, ...values }) : create(values);
            })}
            className="space-y-8"
          >
            <DialogHeader>
              <DialogTitle>Usuário</DialogTitle>
              <DialogDescription>
                Adicione um novo usuário ao sistema
              </DialogDescription>
            </DialogHeader>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email para convite</FormLabel>
                    <FormControl>
                      <Input placeholder="m@qualiflex.com.br" {...field} />
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
    </Dialog>
  );
}
