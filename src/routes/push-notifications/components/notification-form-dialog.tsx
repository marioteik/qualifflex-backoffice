import React from "react";
import { toast } from "sonner";
import { Send, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSendBroadcastNotification } from "@/api/push-notifications";
import { z } from "zod";
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

const notificationFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  body: z.string().min(1, "Mensagem é obrigatória"),
  recipientType: z.enum(["all", "drivers", "seamstress"]),
  data: z.record(z.string()).optional(),
});

type NotificationFormData = z.infer<typeof notificationFormSchema>;

interface NotificationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationFormDialog({
  open,
  onOpenChange,
}: NotificationFormDialogProps) {
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      body: "",
      recipientType: "all",
      data: {},
    },
  });

  const sendNotificationMutation = useSendBroadcastNotification({
    onSuccess: (result: { successCount: number; failureCount: number }) => {
      toast.success(
        `Notificação enviada com sucesso! ${result.successCount} entregues, ${result.failureCount} falharam`
      );
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha ao enviar notificação");
    },
  });

  const handleSubmit = (data: NotificationFormData) => {
    sendNotificationMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar Notificação</DialogTitle>
          <DialogDescription>
            Notifique os usuários do aplicativo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da notificação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mensagem da notificação"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipientType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatários</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label
                          htmlFor="all"
                          className="flex items-center gap-2 cursor-pointer font-normal"
                        >
                          <Users className="h-4 w-4" />
                          Todos os Usuários
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="drivers" id="drivers" />
                        <Label
                          htmlFor="drivers"
                          className="flex items-center gap-2 cursor-pointer font-normal"
                        >
                          <Truck className="h-4 w-4" />
                          Apenas Motoristas
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seamstress" id="seamstress" />
                        <Label
                          htmlFor="seamstress"
                          className="flex items-center gap-2 cursor-pointer font-normal"
                        >
                          <Users className="h-4 w-4" />
                          Apenas Costureiras
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={sendNotificationMutation.isPending}
              >
                {sendNotificationMutation.isPending ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Notificação
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}