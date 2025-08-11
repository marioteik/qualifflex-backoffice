import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, Users, Truck, User, Check, ChevronsUpDown } from "lucide-react";
import { StatsCards } from "./components/stats-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNotificationsHistory, useSendBroadcastNotification } from "@/api/push-notifications";
import { useUsers } from "@/api/users";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const notificationFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título muito longo"),
  body: z.string().min(1, "Mensagem é obrigatória").max(500, "Mensagem muito longa"),
  recipientType: z.enum(["all", "drivers", "specific"]),
  userId: z.string().optional(),
  data: z.record(z.string()).optional(),
}).refine(
  (data) => {
    if (data.recipientType === "specific") {
      return !!data.userId;
    }
    return true;
  },
  {
    message: "Selecione um usuário quando escolher 'Usuário Específico'",
    path: ["userId"],
  }
);

type NotificationFormData = z.infer<typeof notificationFormSchema>;

export default function PushNotificationsPage() {
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  // Fetch initial data for statistics
  const { data } = useNotificationsHistory(20, 0);
  
  // Fetch users for selection
  const { data: users = [] } = useUsers();
  
  // Filter users to only show drivers (roleId: 4) and seamstresses (roleId: 3)
  const selectableUsers = users.filter(
    (user) => user.roleId === 3 || user.roleId === 4
  );

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      body: "",
      recipientType: "all",
      userId: undefined,
      data: {},
    },
  });
  
  const recipientType = form.watch("recipientType");
  
  // Clear userId when recipientType changes
  useEffect(() => {
    if (recipientType !== "specific") {
      form.setValue("userId", undefined);
      setSelectedUserId("");
    }
  }, [recipientType, form]);

  const sendNotificationMutation = useSendBroadcastNotification({
    onSuccess: (result: { successCount: number; failureCount: number }) => {
      toast.success(
        `Notificação enviada com sucesso! ${result.successCount} entregues, ${result.failureCount} falharam`
      );
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha ao enviar notificação");
    },
  });

  const handleSubmit = (data: NotificationFormData) => {
    // Prepare data based on recipient type
    const payload = { ...data };
    
    // Remove userId if not sending to specific user
    if (data.recipientType !== "specific") {
      delete payload.userId;
    }
    
    sendNotificationMutation.mutate(payload);
  };
  
  const getUserLabel = (userId: string) => {
    const user = selectableUsers.find((u) => u.id === userId);
    if (!user) return "Selecione um usuário";
    const role = user.roleId === 3 ? "Costureira" : "Motorista";
    return `${user.name || user.email || user.phone} - ${role}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold">Notificações Push</h1>
        <p className="text-muted-foreground">
          Envie notificações push para usuários do aplicativo móvel
        </p>
      </div>

      {/* Statistics Cards */}
      <StatsCards data={data} />

      {/* Notification Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Enviar Notificação</CardTitle>
          <CardDescription>
            Preencha o formulário abaixo para enviar uma notificação aos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid gap-6">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o título da notificação" 
                          {...field}
                          disabled={sendNotificationMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Body Field */}
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a mensagem da notificação"
                          rows={4}
                          {...field}
                          disabled={sendNotificationMutation.isPending}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Recipient Type Field */}
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
                          disabled={sendNotificationMutation.isPending}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors">
                            <RadioGroupItem value="all" id="all" />
                            <Label
                              htmlFor="all"
                              className="flex items-center gap-2 cursor-pointer font-normal flex-1"
                            >
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>Todos os Usuários</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors">
                            <RadioGroupItem value="drivers" id="drivers" />
                            <Label
                              htmlFor="drivers"
                              className="flex items-center gap-2 cursor-pointer font-normal flex-1"
                            >
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span>Apenas Motoristas</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors">
                            <RadioGroupItem value="specific" id="specific" />
                            <Label
                              htmlFor="specific"
                              className="flex items-center gap-2 cursor-pointer font-normal flex-1"
                            >
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Usuário Específico</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* User Selection Field - Only visible when "specific" is selected */}
                {recipientType === "specific" && (
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecionar Usuário *</FormLabel>
                        <Popover open={openUserSelect} onOpenChange={setOpenUserSelect}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openUserSelect}
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={sendNotificationMutation.isPending}
                              >
                                {field.value
                                  ? getUserLabel(field.value)
                                  : "Selecione um usuário..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Buscar usuário..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                                <CommandGroup heading="Motoristas">
                                  {selectableUsers
                                    .filter((user) => user.roleId === 4)
                                    .map((user) => (
                                      <CommandItem
                                        key={user.id}
                                        value={`${user.name} ${user.email} ${user.phone}`}
                                        onSelect={() => {
                                          form.setValue("userId", user.id);
                                          setSelectedUserId(user.id);
                                          setOpenUserSelect(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === user.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span>{user.name || user.email || user.phone}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {user.email && user.phone
                                              ? `${user.email} • ${user.phone}`
                                              : user.email || user.phone}
                                          </span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandGroup heading="Costureiras">
                                  {selectableUsers
                                    .filter((user) => user.roleId === 3)
                                    .map((user) => (
                                      <CommandItem
                                        key={user.id}
                                        value={`${user.name} ${user.email} ${user.phone}`}
                                        onSelect={() => {
                                          form.setValue("userId", user.id);
                                          setSelectedUserId(user.id);
                                          setOpenUserSelect(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === user.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span>{user.name || user.email || user.phone}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {user.email && user.phone
                                              ? `${user.email} • ${user.phone}`
                                              : user.email || user.phone}
                                          </span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="submit"
                  size="lg"
                  disabled={sendNotificationMutation.isPending}
                  className="min-w-[200px]"
                >
                  {sendNotificationMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Notificação
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}