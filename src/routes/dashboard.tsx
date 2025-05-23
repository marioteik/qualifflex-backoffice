import { useDashboardData } from "@/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertCircle, CheckCircle, Package, Truck, Users } from "lucide-react";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const statusColors = {
  Pendente: "bg-muted",
  Confirmado: "bg-muted",
  Produzindo: "bg-muted",
  Finalizado: "bg-muted",
  Coletado: "bg-muted",
  Recusado: "bg-muted",
};

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  const metrics = useMemo(() => data?.metrics || {}, [data]);
  const recentShipments = useMemo(() => data?.recentShipments || [], [data]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Erro ao carregar dados do dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Remessas"
          value={metrics.totalShipments}
          icon={<Truck className="size-6" />}
          trend={metrics.shipmentsTrend}
          loading={isLoading}
        />
        <MetricCard
          title="Itens Processados"
          value={metrics.totalItems}
          icon={<Package className="size-6" />}
          trend={metrics.itemsTrend}
          loading={isLoading}
        />
        <MetricCard
          title="Aprovações Pendentes"
          value={metrics.pendingApprovals}
          icon={<CheckCircle className="size-6" />}
          trend={metrics.approvalsTrend}
          loading={isLoading}
        />
        <MetricCard
          title="Costureiras Ativas"
          value={metrics.activeRecipients}
          icon={<Users className="size-6" />}
          trend={metrics.recipientsTrend}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Remessas por Dia (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentsChart data={recentShipments} loading={isLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status das Remessas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.statusDistribution?.map((status) => (
              <div key={status.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{status.name}</span>
                  <span className="text-sm font-medium">
                    {status.percentage}%
                  </span>
                </div>
                <Progress
                  value={status.percentage}
                  className={statusColors[status.name]}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ShipmentsChart({ data, loading }: { data: any[]; loading: boolean }) {
  const chartData = useMemo(() => {
    if (!data) return [];

    const dailyCounts = data.reduce((acc, shipment) => {
      const date = format(shipment.createdAt, "dd/MM");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count,
    }));
  }, [data]);

  if (loading) {
    return <Skeleton className="h-[300px] w-full rounded-md" />;
  }

  if (!chartData.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="1" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              borderRadius: "5px",
              border: "none",
            }}
            formatter={(value) => [value, "Remessas"]}
          />
          <Bar
            dataKey="count"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, loading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        {icon}{" "}
        <CardTitle className="text-base text-muted-foreground font-medium !mt-0">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <span className={trend > 0 ? "text-success" : "text-destructive"}>
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
              <span className="ml-1">últimos 30 dias</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
