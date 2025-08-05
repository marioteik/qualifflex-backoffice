import {
  BadgeCheck,
  Bell,
  Check,
  ChevronsUpDown,
  LogOut,
  MonitorCog,
  Moon,
  Sun,
  SwatchBook,
  Lock,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useGlobalStore } from "@/stores/global-store";
import { useShallow } from "zustand/react/shallow";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { theme, setTheme, session } = useGlobalStore(
    useShallow((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
      session: state.session,
    })),
  );

  const user = session?.user;

  // const words = useMemo(() => name.split(/\s+/).filter(Boolean), [name]);
  //
  // const acronym = useMemo(() => {
  //   if (words.length >= 2) {
  //     return (
  //       words[0].slice(0, 1).toUpperCase() +
  //       words[words.length - 1].slice(0, 1).toUpperCase()
  //     );
  //   }
  //   return words[0]?.slice(0, 2).toUpperCase() ?? "";
  // }, [words]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="configuracoes">
                  <BadgeCheck size={20} />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="auth/change-password">
                  <Lock size={20} />
                  Alterar Senha
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell size={20} />
                Notificações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SwatchBook />
                  Tema
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    {theme === "light" ? (
                      <Check className="text-primary" />
                    ) : (
                      <Sun />
                    )}
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    {theme === "dark" ? (
                      <Check className="text-primary" />
                    ) : (
                      <Moon />
                    )}
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    {theme === "system" ? (
                      <Check className="text-primary" />
                    ) : (
                      <MonitorCog />
                    )}
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="auth/sign-out" className="w-full">
                <LogOut size={20} />
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
