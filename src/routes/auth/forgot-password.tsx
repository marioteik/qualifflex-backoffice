import logo from "@/assets/logo.png";
import apollo from "@/assets/apolo_login.png";
import { Input } from "@/components/ui/input";
import { Navigate } from "react-router-dom";
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
import { toast } from "sonner";
import axios from "axios";
import { useGlobalStore } from "@/stores/global-store";
import { useForgotPassword } from "@/api/auth";

enum ForgotPasswordMessages {
  user_not_found = "Usuário não encontrado",
}

export default function ForgotPassword() {
  const session = useGlobalStore((state) => state.session);

  const form = useForm<Auth>({
    resolver: zodResolver(authZodSchema.omit({ code: true })),
    defaultValues: {
      email: "",
    },
  });

  const { mutate } = useForgotPassword({
    onSuccess() {
      toast.success("Email de recuperação enviado com sucesso");
    },
    onError(err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          ForgotPasswordMessages[
            err.response?.data as keyof typeof ForgotPasswordMessages
          ]
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
              src={logo}
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
              <Button type="submit" className="w-full">
                Enviar
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={apollo}
          alt="Apolo Mascote"
          className="h-full w-full object-cover object-right"
        />
      </div>
    </div>
  );
}
