import { create } from "zustand";
import type { Row } from "@tanstack/react-table";
import { selectRoleSchema } from "@/schemas/roles";
import { z } from "zod";

export type RolesRow = Row<z.infer<typeof selectRoleSchema>>["original"] | null;

type State = {
  isEditOpen: boolean;
  setIsEditOpen: (isEditOpen: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (isEditOpen: boolean) => void;
  row: RolesRow;
  setRow: (row: RolesRow) => void;
};

export const useRolesStore = create<State>((set) => ({
  row: null,
  setRow: (row: RolesRow) => set(() => ({ row })),
  isEditOpen: false,
  setIsEditOpen: (isEditOpen: boolean) =>
    set((state) => ({ isEditOpen: isEditOpen ?? !state.isEditOpen })),
  isDeleteOpen: false,
  setIsDeleteOpen: (isDeleteOpen: boolean) =>
    set((state) => ({ isDeleteOpen: isDeleteOpen ?? !state.isDeleteOpen })),
}));
