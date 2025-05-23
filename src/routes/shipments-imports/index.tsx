import { formatDate } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useShipmentsImports } from "@/api/shipments-imports";

export default function ShipmentImports() {
  const {
    data: shipmentImports,
    isPending: isLoading,
    error,
  } = useShipmentsImports();

  return (
    <div className="">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Remessas Sincronizadas</CardTitle>
            <CardDescription>
              Histórico de sincronizações automáticas de remessas no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40 text-destructive">
                {error.message}
              </div>
            ) : shipmentImports.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-muted-foreground">
                Nenhuma sincronização de remessas encontrada.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data da Sincronização</TableHead>
                    <TableHead>Remessas Importadas</TableHead>
                    <TableHead>Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipmentImports.map((importItem) => (
                    <TableRow key={importItem.id}>
                      <TableCell className="text-sm text-nowrap">
                        {formatDate(
                          new Date(importItem.createdAt).toISOString(),
                          "dd/MM/yyyy HH:mm:ss"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {importItem.shipments.map((shipment, index) => (
                            <Badge key={index} variant="secondary">
                              {shipment}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{importItem.shipments.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
