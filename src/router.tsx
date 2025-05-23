import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { BreadcrumbLink } from "./components/ui/breadcrumb";
import { queryClient } from "@/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { destroySession, useGlobalStore } from "@/stores/global-store";
import Root from "./routes/root";
import SignIn from "@/routes/auth/signin";
import ErrorPage from "./error-page";
import Dashboard from "@/routes/dashboard";
import Roles from "@/routes/permissions/roles";
import Providers from "./providers";
import PermissionsWrapper from "@/routes/permissions";
import Users from "@/routes/users";
import Shipments from "@/routes/shipments";
import Chats from "./routes/chats";
import LoadList from "@/routes/load-list";
import Products from "@/routes/products";
import Orders from "@/routes/orders";
import apiClient from "./api-client";
import ForgotPassword from "./routes/auth/forgot-password";
import ShipmentsImports from "./routes/shipments-imports";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Providers>
        <Root />
      </Providers>
    ),
    loader: async () => {
      const session = useGlobalStore.getState().session;

      if (!session) {
        return redirect("/auth/sign-out");
      }

      return null;
    },
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        errorElement: <ErrorPage />,
      },
      {
        path: "permissions-admin",
        element: (
          <PermissionsWrapper>
            <Outlet />
          </PermissionsWrapper>
        ),
        handle: {
          crumb: () => <BreadcrumbLink>Permissionamento</BreadcrumbLink>,
        },
        children: [
          {
            index: true,
            element: <Navigate to="/permissions-admin/roles" />,
          },
          {
            path: "roles",
            element: <Roles />,
            handle: {
              crumb: () => (
                <BreadcrumbLink asChild>
                  <Link to="/permissions-admin/roles">Papéis</Link>
                </BreadcrumbLink>
              ),
            },
          },
        ],
      },
      {
        path: "shipments",
        element: <Outlet />,
        handle: {
          crumb: () => <BreadcrumbLink>Remessas</BreadcrumbLink>,
        },
        children: [
          {
            index: true,
            element: <Navigate to="/shipments/all" />,
          },
          {
            path: "all",
            element: <Shipments key="all" />,
            handle: {
              crumb: () => (
                <BreadcrumbLink asChild>
                  <Link to="/shipments/all">Todas</Link>
                </BreadcrumbLink>
              ),
            },
          },
          {
            path: "pending",
            element: <Shipments key="pending" />,
            handle: {
              crumb: () => (
                <BreadcrumbLink asChild>
                  <Link to="/shipments/pending">Pendentes</Link>
                </BreadcrumbLink>
              ),
            },
          },
          {
            path: "in-production",
            element: <Shipments key="in-production" />,
            handle: {
              crumb: () => (
                <BreadcrumbLink asChild>
                  <Link to="/shipments/in-production">Em Produção</Link>
                </BreadcrumbLink>
              ),
            },
          },
          {
            path: "collected",
            element: <Shipments key="collected" />,
            handle: {
              crumb: () => (
                <BreadcrumbLink asChild>
                  <Link to="/shipments/collected">Em Produção</Link>
                </BreadcrumbLink>
              ),
            },
          },
          {
            path: "refused",
            element: <Shipments key="refused" />,
            handle: {
              crumb: () => (
                <BreadcrumbLink asChild>
                  <Link to="/shipments/refused">Recusados</Link>
                </BreadcrumbLink>
              ),
            },
          },
          {
            path: "archive",
            element: <Shipments key="archive" />,
            handle: {
              crumb: () => (
                <BreadcrumbLink asChild>
                  <Link to="/shipments/arquivo">Arquivo</Link>
                </BreadcrumbLink>
              ),
            },
          },
        ],
      },
      // {
      //   path: "dynamic-map",
      //   element: <DynamicMap />,
      //   handle: {
      //     crumb: () => (
      //       <BreadcrumbLink asChild>
      //         <Link to="/dynamic-map">Mapa Dinâmico</Link>
      //       </BreadcrumbLink>
      //     ),
      //   },
      // },
      {
        path: "load-list",
        element: <LoadList />,
        handle: {
          crumb: () => (
            <BreadcrumbLink asChild>
              <Link to="/dynamic-map">Romaneio</Link>
            </BreadcrumbLink>
          ),
        },
      },
      {
        path: "support-chat",
        element: <Chats />,
        handle: {
          crumb: () => (
            <BreadcrumbLink asChild>
              <Link to="/user-management">Atendimentos</Link>
            </BreadcrumbLink>
          ),
        },
      },
      {
        path: "user-management",
        element: <Users />,
        handle: {
          crumb: () => (
            <BreadcrumbLink asChild>
              <Link to="/user-management">Gerencimento de Usuários</Link>
            </BreadcrumbLink>
          ),
        },
      },
      {
        path: "products",
        element: <Products />,
        handle: {
          crumb: () => (
            <BreadcrumbLink asChild>
              <Link to="/products">Produtos</Link>
            </BreadcrumbLink>
          ),
        },
      },
      {
        path: "orders",
        element: <Orders />,
        handle: {
          crumb: () => (
            <BreadcrumbLink asChild>
              <Link to="/orders">Ordens de Pedido</Link>
            </BreadcrumbLink>
          ),
        },
      },
      {
        path: "shipments-imports",
        element: <ShipmentsImports />,
        handle: {
          crumb: () => (
            <BreadcrumbLink asChild>
              <Link to="/shipments-imports">Remessas sincronizadas</Link>
            </BreadcrumbLink>
          ),
        },
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster richColors />
      </QueryClientProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/sign-in" />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-out",
        loader: async () => {
          apiClient.post(
            import.meta.env.VITE_API_DOMAIN + "/api/auth/sign-out"
          );
          destroySession();
          return redirect("/auth/sign-in");
        },
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "confirm",
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const accessToken = url.searchParams.get("access_token");
          const refreshToken = url.searchParams.get("refresh_token");
          console.log(accessToken, refreshToken);

          return null;
        },
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
