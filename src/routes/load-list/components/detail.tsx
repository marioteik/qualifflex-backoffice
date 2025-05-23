import React from "react";
import { DataTable } from "./data-table";

const DetailPanel: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <DataTable />
    </div>
  );
};

export default DetailPanel;
