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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { insertUser } from "@/schemas/auth";
import { useUsersStore } from "@/routes/users/data/store";
import { useCreateUser, useUpdateUser } from "@/api/users";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useRoles } from "@/api/roles";
import { useSeamstress } from "@/api/seamstress";
import { onError } from "@/lib/utils/error-handling";

export default function UserForm() {
  const { row, setIsClose, opened } = useUsersStore(
    useShallow((state) => ({
      row: state.row,
      setIsClose: state.setIsClose,
      opened: state.isEditOpen,
    }))
  );

  const form = useForm<z.infer<typeof insertUser>>({
    resolver: zodResolver(insertUser),
    reValidateMode: "onBlur",
    defaultValues: {
      id: String(row?.id ?? ""),
      name: String(row?.profile?.fullName ?? ""),
      email: String(row?.email ?? ""),
      phone: String(row?.phone ?? ""),
      role: String(row?.role.id ?? ""),
      seamstress: String(row?.seamstress ?? ""),
    },
  });

  const selectedRole = form.watch("role");

  const { data: roles } = useRoles();
  const { data: seamstress } = useSeamstress({ enabled: !!selectedRole });

  const { mutate: create } = useCreateUser({
    onError,
    onSuccess: () => {
      toast.success(
        `Usuário ${form.getValues().email} adicionado com sucesso!`
      );
      form.reset();
      setIsClose();
    },
  });

  const { mutate: update } = useUpdateUser({
    onError,
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

            <div className="inline-flex gap-x-6 w-full">
              <div className="flex-1 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@qualiflex.com.br" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Papel</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value ? String(field.value) : ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um papel" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem value={String(role.id)} key={role.id}>
                                {role.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedRole === "3" && (
                  <FormField
                    control={form.control}
                    name="seamstress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecione a Costureira</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma costureira" />
                            </SelectTrigger>
                            <SelectContent>
                              {seamstress.map((item) => (
                                <SelectItem value={item.id} key={item.id}>
                                  {item.businessInfo.tradeName ||
                                    item.businessInfo.nameCorporateReason ||
                                    item.businessInfo.contact}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
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
