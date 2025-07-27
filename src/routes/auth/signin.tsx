import { Input } from "@/components/ui/input";
import { Link, Navigate } from "react-router-dom";
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
import { type Auth, authZodSchema } from "@/schemas/auth";
import { useSighIn } from "@/api/auth";
import { toast } from "sonner";
import axios from "axios";
import { useGlobalStore } from "@/stores/global-store";
import { useShallow } from "zustand/react/shallow";

enum LoginMessages {
  invalid_credentials = "Usuário ou senha incorretos.",
  weak_password = "Your password should have at least 8 digits",
  over_email_send_rate_limit = "Por favor, espere 1m para cadastrar novamente",
  email_not_confirmed = "Email não verificado",
  user_banned = "Usuário bloqueado. Favor contactar o administrador do sistema.",
}

export default function SignIn() {
  const { session, setSession } = useGlobalStore(
    useShallow((state) => ({
      session: state.session,
      setSession: state.setSession,
    }))
  );

  const form = useForm<Auth>({
    resolver: zodResolver(authZodSchema.omit({ code: true })),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate } = useSighIn({
    onSuccess(data) {
      setSession(data);
    },
    onError(err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          LoginMessages[err.response?.data as keyof typeof LoginMessages]
        );
        return;
      }
    },
  });

  const handleSubmit = (data: Auth) => {
    mutate(data);
  };

  if (session) {
    const path = localStorage.getItem("current-location");

    return <Navigate to={path?.includes("auth") ? "/" : path ?? "/"} />;
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

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid gap-4"
            >
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
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <Link
                          to="/auth/forgot-password"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Esqueceu sua senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Digite sua senha..."
                          {...field}
                          type="password"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                asChild
              >
                <a href="mailto:renan@qualiflex.com">
                  Requisite acesso ao Administrador
                </a>
              </Button>
            </form>
          </Form>
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
