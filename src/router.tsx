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
import OrdersToBuy from "@/routes/orders-to-buy";
import apiClient from "./api-client";
import ForgotPassword from "./routes/auth/forgot-password";
import ShipmentsImports from "./routes/shipments-imports";
import axios from "axios";
import { getApiUrl } from "@/lib/utils/api-url";

// Get the base path from environment variable and normalize it
const getBasename = () => {
  const basePath = import.meta.env.VITE_BASE_PATH || "/";
  // React Router expects basename without trailing slash, except for root
  return basePath === "/" ? "" : basePath.replace(/\/$/, "");
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Providers>
          <Root />
        </Providers>
      ),
      loader: async () => {
        const hash = window.location.hash;

        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          const expiresAt = hashParams.get("expires_at");
          const expiresIn = hashParams.get("expires_in");
          const tokenType = hashParams.get("token_type");

          const { data, status } = await axios.get(getApiUrl("/auth/verify"), {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (status !== 200) {
            return redirect("/auth/sign-in");
          }

          if (data.user) {
            await new Promise((resolve) => {
              useGlobalStore.getState().setSession?.({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: expiresAt,
                token_type: tokenType,
                expires_in: expiresIn,
                user: data.user,
              });

              setTimeout(() => {
                resolve(true);
              }, 200);
            });

            window.history.replaceState(null, "", "/");
            return redirect("/");
          }

          return null;
        }

        const session = useGlobalStore.getState().session;

        if (!session) {
          return redirect("/auth/sign-in");
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
              children: [
                {
                  path: ":id",
                  element: <Shipments key="all" />,
                  handle: {
                    crumb: () => (
                      <BreadcrumbLink asChild>
                        <Link to="/shipments/all">Todas</Link>
                      </BreadcrumbLink>
                    ),
                  },
                },
              ],
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
              children: [
                {
                  path: ":id",
                  element: <Shipments key="pending" />,
                  handle: {
                    crumb: () => (
                      <BreadcrumbLink asChild>
                        <Link to="/shipments/pending">Pendentes</Link>
                      </BreadcrumbLink>
                    ),
                  },
                },
              ],
            },
            {
              path: "pending-approval",
              element: <Shipments key="pending-approval" />,
              handle: {
                crumb: () => (
                  <BreadcrumbLink asChild>
                    <Link to="/shipments/pending-approval">
                      Aguardando aprovação
                    </Link>
                  </BreadcrumbLink>
                ),
              },
              children: [
                {
                  path: ":id",
                  element: <Shipments key="pending-approval" />,
                  handle: {
                    crumb: () => (
                      <BreadcrumbLink asChild>
                        <Link to="/shipments/pending-approval">
                          Aguardando aprovação
                        </Link>
                      </BreadcrumbLink>
                    ),
                  },
                },
              ],
            },
            {
              path: "confirmed",
              element: <Shipments key="confirmed" />,
              handle: {
                crumb: () => (
                  <BreadcrumbLink asChild>
                    <Link to="/shipments/confirmed">Confirmados</Link>
                  </BreadcrumbLink>
                ),
              },
              children: [
                {
                  path: ":id",
                  element: <Shipments key="confirmed" />,
                  handle: {
                    crumb: () => (
                      <BreadcrumbLink asChild>
                        <Link to="/shipments/confirmed">Confirmados</Link>
                      </BreadcrumbLink>
                    ),
                  },
                },
              ],
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
              children: [
                {
                  path: ":id",
                  element: <Shipments key="in-production" />,
                  handle: {
                    crumb: () => (
                      <BreadcrumbLink asChild>
                        <Link to="/shipments/in-production">Em Produção</Link>
                      </BreadcrumbLink>
                    ),
                  },
                },
              ],
            },
            {
              path: "collected",
              element: <Shipments key="collected" />,
              handle: {
                crumb: () => (
                  <BreadcrumbLink asChild>
                    <Link to="/shipments/collected">Coletados</Link>
                  </BreadcrumbLink>
                ),
              },
              children: [
                {
                  path: ":id",
                  element: <Shipments key="collected" />,
                  handle: {
                    crumb: () => (
                      <BreadcrumbLink asChild>
                        <Link to="/shipments/collected">Coletados</Link>
                      </BreadcrumbLink>
                    ),
                  },
                },
              ],
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
              children: [
                {
                  path: ":id",
                  element: <Shipments key="refused" />,
                  handle: {
                    crumb: () => (
                      <BreadcrumbLink asChild>
                        <Link to="/shipments/refused">Recusados</Link>
                      </BreadcrumbLink>
                    ),
                  },
                },
              ],
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
              children: [
                {
                  path: ":id",
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
          element: <Outlet />,
          handle: {
            crumb: () => <BreadcrumbLink>Ordens de Produção</BreadcrumbLink>,
          },
          children: [
            {
              index: true,
              element: <Orders />,
            },
            {
              path: ":id",
              element: <Orders />,
              handle: {
                crumb: () => (
                  <BreadcrumbLink>Ordens de Produção</BreadcrumbLink>
                ),
              },
            },
          ],
        },
        {
          path: "orders-to-buy",
          element: <Outlet />,
          handle: {
            crumb: () => <BreadcrumbLink>Ordens de Compra</BreadcrumbLink>,
          },
          children: [
            {
              index: true,
              element: <OrdersToBuy />,
            },
            {
              path: ":id",
              element: <OrdersToBuy />,
              handle: {
                crumb: () => <BreadcrumbLink>Ordens de Compra</BreadcrumbLink>,
              },
            },
          ],
        },
        {
          path: "shipments-imports",
          element: <ShipmentsImports />,
          handle: {
            crumb: () => (
              <BreadcrumbLink asChild>
                <Link to="/shipments-imports">Remessas importadas</Link>
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
            apiClient.post("/api/auth/sign-out");
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
  ],
  {
    basename: getBasename(),
  }
);

export default function Router() {
  return <RouterProvider router={router} />;
}
