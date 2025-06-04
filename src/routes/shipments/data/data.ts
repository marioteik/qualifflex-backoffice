import {
  BadgeCheck,
  BookmarkCheck,
  LoaderCircle,
  PackageCheck,
  ScissorsLineDashed,
  TicketX,
} from "lucide-react";

export const statusOrder = [
  "Recusado",
  "Pendente",
  "Confirmado",
  "Produzindo",
  "Produção parcial",
  "Finalizado",
  "Coletado",
];

export const status = [
  { label: "Recusado", value: "Recusado", icon: TicketX },
  { label: "Pendente", value: "Pendente", icon: LoaderCircle },
  {
    label: "Pendente aprovação",
    value: "Pendente aprovação",
    icon: LoaderCircle,
  },
  { label: "Confirmado", value: "Confirmado", icon: BadgeCheck },
  { label: "Produzindo", value: "Produzindo", icon: ScissorsLineDashed },
  {
    label: "Produção parcial",
    value: "Produção parcial",
    icon: ScissorsLineDashed,
  },
  { label: "Finalizado", value: "Finalizado", icon: BookmarkCheck },
  { label: "Coletado", value: "Coletado", icon: PackageCheck },
];

export const clearFieldsBasedOnStatus = (
  status: (typeof statusOrder)[number]
) => {
  switch (status) {
    case "Pendente":
      return {
        finishedAt: null,
        deliveredAt: null,
        confirmedAt: null,
        collectedAt: null,
        refusedAt: null,
        informedEstimation: null,
      };
    case "Pendente aprovação":
      return {
        finishedAt: null,
        deliveredAt: null,
        confirmedAt: null,
        collectedAt: null,
        refusedAt: null,
      };
    case "Recusado":
      return {
        finishedAt: null,
        deliveredAt: null,
        confirmedAt: null,
        collectedAt: null,
      };
    case "Confirmado":
      return {
        finishedAt: null,
        deliveredAt: null,
        collectedAt: null,
        refusedAt: null,
      };
    case "Produzindo":
      return {
        finishedAt: null,
        refusedAt: null,
        collectedAt: null,
      };
    case "Produção parcial":
      return {
        finishedAt: null,
        refusedAt: null,
        collectedAt: null,
      };
    case "Finalizado":
      return {
        refusedAt: null,
        collectedAt: null,
      };
    default:
      return {};
  }
};
