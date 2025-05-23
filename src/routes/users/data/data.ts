import {
  Gem,
  Hourglass,
  Lock,
  Truck,
  UserCheck,
  Users,
  Volleyball,
} from "lucide-react";

export const roles = [
  {
    value: "1",
    label: "Admin",
    icon: Gem,
  },
  {
    value: "2",
    label: "Staff",
    icon: Users,
  },
  {
    value: "3",
    label: "Costureira",
    icon: Volleyball,
  },
  {
    value: "4",
    label: "Motorista",
    icon: Truck,
  },
];

export const status = [
  {
    label: "Ativo",
    value: "confirmed",
    icon: UserCheck,
  },
  {
    label: "Desativado",
    value: "banned",
    icon: Lock,
  },
  {
    label: "Falta Confirmação",
    value: "not_confirmed",
    icon: Hourglass,
  },
];
