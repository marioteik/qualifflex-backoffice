import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  User,
  MapPin,
  Package,
  DollarSign,
  Clock,
} from "lucide-react";
import { formatToBRL, formatDate } from "@/lib/utils/formatters";

interface OrderDetailOverviewProps {
  order: any; // Replace with proper order type
}

export default function OrderDetailOverview({
  order,
}: OrderDetailOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Informações do Cliente
          </CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">{order.customer?.name}</p>
              <p className="text-xs text-muted-foreground">
                {order.customer?.email}
              </p>
            </div>
            {order.customer?.phone && (
              <p className="text-xs text-muted-foreground">
                {order.customer.phone}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Endereço de Entrega
          </CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-sm">{order.deliveryAddress?.street}</p>
            <p className="text-xs text-muted-foreground">
              {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
            </p>
            <p className="text-xs text-muted-foreground">
              CEP: {order.deliveryAddress?.zipCode}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-2xl font-bold">
              {formatToBRL(order.totalValue)}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.itemsCount}{" "}
              {order.itemsCount === 1 ? "produto" : "produtos"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data do Pedido</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
            <p className="text-xs text-muted-foreground">
              Criado às {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Prazo de Entrega
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {order.deliveryDate
                ? formatDate(order.deliveryDate)
                : "Não definido"}
            </p>
            {order.deliveryDate && (
              <p className="text-xs text-muted-foreground">
                {new Date(order.deliveryDate) > new Date()
                  ? "Pendente"
                  : "Vencido"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progresso</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Remessas</span>
              <span>{order.shipmentsCount || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Produtos Produzidos</span>
              <span>
                {order.producedItems || 0}/{order.totalItems || 0}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{
                  width: `${
                    ((order.producedItems || 0) / (order.totalItems || 1)) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
