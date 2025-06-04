import { Table, type RowSelectionState } from "@tanstack/react-table";
import { DataTableViewOptions } from "@/components/atoms/data-table-view-options";
import { DebouncedInput } from "@/components/atoms/debounced-input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const nameSearch = table.getColumn("codeReference")?.getFilterValue();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DebouncedInput
          value={nameSearch as string}
          className="md:text-sm h-8 w-[260px]"
          debounce={200}
          onChange={(value) => {
            table.getColumn("codeReference")?.setFilterValue(value);
          }}
          placeholder="OP, Remessa, Material e Emissão"
        />
      </div>

      <div className="inline-flex gap-2">
        <DataTableViewOptions table={table} hideColumns={["materials"]} />
      </div>
    </div>
  );
}
