import { Input } from "@/components/ui/input";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { useGlobalStore } from "@/stores/global-store";
import { useChangePassword } from "@/api/auth";
import { z } from "zod";

const changePasswordSchema = z.object({
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

enum ChangePasswordMessages {
  weak_password = "A nova senha deve ter pelo menos 8 caracteres",
  password_change_success = "Senha alterada com sucesso",
}

export default function ChangePassword() {
  const session = useGlobalStore((state) => state.session);
  const navigate = useNavigate();

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useChangePassword({
    onSuccess() {
      toast.success(ChangePasswordMessages.password_change_success);
      form.reset();
    },
    onError(err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          ChangePasswordMessages[
            err.response?.data as keyof typeof ChangePasswordMessages
          ] || "Erro ao alterar senha"
        );
        return;
      }
      toast.error("Erro ao alterar senha");
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    mutate(data, {
      async onSuccess() {
        await new Promise((resolve) => {
          useGlobalStore.getState().setSession?.(null);

          setTimeout(() => {
            resolve(true);
          }, 100);
        });

        navigate("/auth/sign-in", { replace: true });
        toast.success(ChangePasswordMessages.password_change_success);
      },
    });
  };

  if (!session) {
    return <Navigate to="/auth/sign-in" />;
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 bg-white dark:bg-background">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-10">
          <h1 className="text-3xl font-bold">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-auto w-full object-cover object-right dark:brightness-[0.2] dark:grayscale"
            />
          </h1>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Alterar Senha</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Login feito com link de e-mail, por favor, altere sua senha.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite a nova senha..."
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirme a nova senha..."
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Alterando..." : "Alterar Senha"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/apolo_login.png"
          alt="Apolo Mascote"
          className="h-full w-full object-cover object-right"
        />
      </div>
    </div>
  );
} 