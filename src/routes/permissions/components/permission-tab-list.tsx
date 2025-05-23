import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";

export const PermissionTabList = () => {
  const { pathname } = useLocation();

  return (
    <TabsList>
      <TabsTrigger
        value="papeis"
        asChild
        data-state={pathname.includes("roles") && "active"}
      >
        <Link to="/permissions-admin/roles">Papéis</Link>
      </TabsTrigger>
      <TabsTrigger
        value="permissoes"
        asChild
        data-state={
          pathname.split("/").pop()?.[0].includes("permissions") && "active"
        }
      >
        <Link to="/permissions-admin/permissions">Permissões</Link>
      </TabsTrigger>
    </TabsList>
  );
};

export default PermissionTabList;
