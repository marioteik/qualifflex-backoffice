import * as React from "react";
import {
  Boxes,
  CogIcon,
  LayoutDashboard,
  LockIcon,
  MapIcon,
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

// This is sample data.
const data = {
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
        },
        {
          title: "Aguardando confirmação",
          url: "/shipments/pending",
        },
        {
          title: "Produzindo",
          url: "/shipments/in-production",
        },
        {
          title: "Coletados",
          url: "/shipments/collected",
        },
        {
          title: "Recusados",
          url: "/shipments/refused",
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
      name: "Remessas sincronizadas",
      url: "/shipments-imports",
      icon: PackageSearch,
    },
    {
      name: "Configurações",
      url: "/configuracoes",
      icon: CogIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <ModuleSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <Separator />
          <NavAdministration administration={data.administration} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
