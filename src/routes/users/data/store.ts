import { create } from "zustand";
import type { Row } from "@tanstack/react-table";
import type { User } from "@/schemas/auth";

export type UsersRow = Row<User>["original"] | null;

type State = {
  isEditOpen: boolean;
  setIsEditOpen: (isEditOpen: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (isEditOpen: boolean) => void;
  isDisableOpen: boolean;
  setIsDisableOpen: (isEditOpen: boolean) => void;
  setIsClose: () => void;
  row: UsersRow;
  setRow: (row: UsersRow) => void;
};

export const useUsersStore = create<State>((set) => ({
  row: null,
  setRow: (row: UsersRow) => set(() => ({ row })),
  isEditOpen: false,
  setIsEditOpen: (isEditOpen: boolean) =>
    set((state) => ({ isEditOpen: isEditOpen ?? !state.isEditOpen })),
  isDeleteOpen: false,
  setIsDeleteOpen: (isDeleteOpen: boolean) =>
    set((state) => ({ isDeleteOpen: isDeleteOpen ?? !state.isDeleteOpen })),
  isDisableOpen: false,
  setIsDisableOpen: (isDisableOpen: boolean) =>
    set((state) => ({ isDisableOpen: isDisableOpen ?? !state.isDisableOpen })),
  setIsClose: () =>
    set({
      isDeleteOpen: false,
      isEditOpen: false,
      isDisableOpen: false,
      row: null,
    }),
}));
