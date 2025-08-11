import * as React from "react";
import {
  Bell,
  Boxes,
  CogIcon,
  LayoutDashboard,
  LockIcon,
  MessagesSquare,
  PackageSearch,
  Target,
  Truck,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavAdministration } from "@/components/nav-administration";
import { NavUser } from "@/components/nav-user";
import { ModuleSwitcher } from "@/components/module-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Roles, useGlobalStore } from "@/stores/global-store";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useShipments } from "@/api/shipments";
import { useChatRooms } from "@/api/chat-rooms";
import { ShipmentStatus } from "@/schemas/shipments";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role = useGlobalStore((state) => state.role);
  const location = useLocation();

  const { data: shipments } = useShipments();
  const { data: chatRooms } = useChatRooms();

  const sumEachStatus = useMemo(
    () =>
      shipments?.reduce((acc, shipment) => {
        const status = shipment.status;
        if (status) {
          acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
    [shipments]
  );

  const hasNewMessages = useMemo(
    () =>
      (chatRooms?.some((room) => room.isNew) ?? false) &&
      !location.pathname.includes("/support-chat"),
    [chatRooms, location.pathname]
  );

  const menu = useMemo(
    () => ({
      teams: [
        {
          name: "FRS",
          logo: Truck,
          plan: "Remessas",
        },
      ],
      navMain: [
        {
          title: "Resumo",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Remessas",
          url: "/shipments",
          icon: PackageSearch,
          items: [
            {
              title: "Todas",
              url: "/shipments/all",
              badge: shipments?.length ?? 0,
            },
            {
              title: "Pendente confirmação",
              url: "/shipments/pending",
              badge: sumEachStatus?.[ShipmentStatus.PENDING] ?? 0,
            },
            {
              title: "Aguardando aprovação",
              url: "/shipments/pending-approval",
              badge: sumEachStatus?.[ShipmentStatus.PENDING_APPROVAL] ?? 0,
            },
            {
              title: "Confirmados",
              url: "/shipments/confirmed",
              badge: sumEachStatus?.[ShipmentStatus.CONFIRMED] ?? 0,
            },
            {
              title: "Produzindo",
              url: "/shipments/in-production",
              badge: sumEachStatus?.[ShipmentStatus.IN_PRODUCTION] ?? 0,
            },
            {
              title: "Coletados",
              url: "/shipments/collected",
              badge: sumEachStatus?.[ShipmentStatus.COLLECTED] ?? 0,
            },
            {
              title: "Recusados",
              url: "/shipments/refused",
              badge: sumEachStatus?.[ShipmentStatus.REFUSED] ?? 0,
            },
            {
              title: "Arquivo",
              url: "/shipments/archive",
            },
          ],
        },
        {
          title: "Romaneio",
          url: "/load-list",
          icon: Truck,
        },
        // {
        //   title: "Mapa Dinâmico",
        //   url: "/dynamic-map",
        //   icon: MapIcon,
        // },
        {
          title: "Ordens de Produção",
          url: "/orders",
          icon: Target,
        },
        {
          title: "Produtos",
          url: "/products",
          icon: Boxes,
        },
        {
          title: "Atendimentos",
          url: "/support-chat",
          icon: MessagesSquare,
          hasNewMessages,
        },
      ],
      administration: [
        {
          name: "Usuários",
          url: "/user-management",
          icon: Users,
        },
        {
          name: "Permissionamento",
          url: "/permissions-admin/roles",
          icon: LockIcon,
        },
        {
          name: "Remessas Importadas",
          url: "/shipments-imports",
          icon: PackageSearch,
        },
        {
          name: "Push Notifications",
          url: "/push-notifications",
          icon: Bell,
        },
        {
          name: "Configurações",
          url: "/configuracoes",
          icon: CogIcon,
        },
      ],
    }),
    [shipments, sumEachStatus, hasNewMessages]
  );

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <ModuleSwitcher teams={menu.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={menu.navMain} />
          {role === Roles.ADMIN && (
            <>
              <Separator />
              <NavAdministration administration={menu.administration} />
            </>
          )}
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
