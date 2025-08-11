import {
  Users,
  Truck,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export const recipientTypes = [
  {
    value: "all",
    label: "Todos Usuários",
    icon: Users,
  },
  {
    value: "drivers",
    label: "Motoristas",
    icon: Truck,
  },
  {
    value: "seamstress",
    label: "Costureiras",
    icon: UserCheck,
  },
  {
    value: "specific",
    label: "Usuários Específicos",
    icon: Users,
  },
];

export const notificationStatuses = [
  {
    value: "sent",
    label: "Enviado",
    icon: CheckCircle2,
    variant: "success" as const,
  },
  {
    value: "failed",
    label: "Falhou",
    icon: XCircle,
    variant: "destructive" as const,
  },
  {
    value: "pending",
    label: "Pendente",
    icon: Clock,
    variant: "secondary" as const,
  },
];