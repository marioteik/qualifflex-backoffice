import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useProductsStore } from "./data/store";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Products() {
  const { resetStore } = useProductsStore();
  const location = useLocation();

  useEffect(() => {
    resetStore(location.pathname.split("/").pop() as string);
  }, [location.pathname, resetStore]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-col gap-1 flex justify-between">
        <CardTitle>Produtos</CardTitle>
        <CardDescription>Acompanhe o catálogo de produtos.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <DataTable columns={columns} />
      </CardContent>
    </Card>
  );
}
