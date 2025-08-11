import React from "react";
import { Activity, TrendingUp, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PushNotificationList } from "@/schemas/push-notifications";

interface StatsCardsProps {
  data?: PushNotificationList;
}

export function StatsCards({ data }: StatsCardsProps) {
  // Calculate statistics
  const totalSent = data?.total || 0;
  
  const successRate = React.useMemo(() => {
    if (!data?.notifications || data.notifications.length === 0) return 0;
    
    const totalSuccess = data.notifications.reduce(
      (acc, n) => acc + parseInt(n.successCount),
      0
    );
    const totalAttempts = data.notifications.reduce(
      (acc, n) => acc + parseInt(n.successCount) + parseInt(n.failureCount),
      0
    );
    
    if (totalAttempts === 0) return 0;
    return Math.round((totalSuccess / totalAttempts) * 100);
  }, [data]);

  const activeUsers = React.useMemo(() => {
    // This would typically come from a separate API endpoint
    // For now, we'll show a placeholder
    return "-";
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Enviado</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSent}</div>
          <p className="text-xs text-muted-foreground">
            Notificações de todos os tempos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Sucesso
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">
            Percentual de entrega bem-sucedida
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Usuários Ativos
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            Usuários com tokens push
          </p>
        </CardContent>
      </Card>
    </div>
  );
}