import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Users() {
  return (
    <Card className="h-full w-full flex-1 flex flex-col">
      <CardHeader className="flex-col gap-1 flex justify-between">
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Administre usuários e perfis e atribua eles papéis.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <DataTable columns={columns} />
      </CardContent>
    </Card>
  );
}
