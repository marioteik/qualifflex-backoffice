import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PermissionsWrapper({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Card className="h-full w-full flex-1 flex flex-col">
      <CardHeader className="flex-col gap-1 flex justify-between">
        <CardTitle>Permissionamento</CardTitle>
        <CardDescription>
          Administre papéis e permissões e atribua elas a usuários.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">{children}</CardContent>
    </Card>
  );
}
