import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

import type {
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import persistentStorage from "@/stores/persist-storage";

// We’ll import the product type you want to display in rows
import type { SelectProduct } from "@/schemas/products";

export type ProductsRow = Row<SelectProduct>["original"] | null;

interface State {
  // Modal booleans (edit, delete, disable, etc.)
  isEditOpen: boolean;
  setIsEditOpen: (value: boolean) => void;

  isDeleteOpen: boolean;
  setIsDeleteOpen: (value: boolean) => void;

  isDisableOpen: boolean;
  setIsDisableOpen: (value: boolean) => void;

  // Close any open modals
  setIsClose: () => void;

  // Currently selected row
  row: ProductsRow;
  setRow: (row: ProductsRow) => void;

  // Table states
  pagination: PaginationState;
  setPagination: (
    value: PaginationState | ((old: PaginationState) => PaginationState)
  ) => void;

  sorting: SortingState;
  setSorting: (
    value: SortingState | ((old: SortingState) => SortingState)
  ) => void;

  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    value:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => void;

  columnVisibility: VisibilityState;
  setColumnVisibility: (
    value: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void;

  resetStore: (path: string) => void;
}

type InitialState = Omit<
  State,
  | "setIsEditOpen"
  | "setIsDeleteOpen"
  | "setIsDisableOpen"
  | "setIsClose"
  | "setRow"
  | "setPagination"
  | "setSorting"
  | "setColumnFilters"
  | "setColumnVisibility"
  | "resetStore"
>;

const initialState: InitialState = {
  isEditOpen: false,
  isDeleteOpen: false,
  isDisableOpen: false,
  row: null,
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  sorting: [{ id: "code", desc: false }], // Example default sorting
  columnFilters: [],
  columnVisibility: { id: false },
};

export const useProductsStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setIsEditOpen: (isEditOpen) =>
          set(() => ({
            isEditOpen,
          })),

        setIsDeleteOpen: (isDeleteOpen) =>
          set(() => ({
            isDeleteOpen,
          })),

        setIsDisableOpen: (isDisableOpen) =>
          set(() => ({
            isDisableOpen,
          })),

        setIsClose: () =>
          set({
            isEditOpen: false,
            isDeleteOpen: false,
            isDisableOpen: false,
            row: null,
          }),

        setRow: (row) =>
          set(() => ({
            row,
          })),

        // Table state setters
        setPagination: (pagination) =>
          set((state) => ({
            pagination:
              typeof pagination === "function"
                ? pagination(state.pagination)
                : pagination,
          })),

        setSorting: (sorting) =>
          set((state) => ({
            sorting:
              typeof sorting === "function" ? sorting(state.sorting) : sorting,
          })),

        setColumnFilters: (filters) =>
          set((state) => ({
            columnFilters:
              typeof filters === "function"
                ? filters(state.columnFilters)
                : filters,
          })),

        setColumnVisibility: (visibility) =>
          set((state) => ({
            columnVisibility:
              typeof visibility === "function"
                ? visibility(state.columnVisibility)
                : visibility,
          })),

        resetStore: () => {
          const _initialState = { ...initialState };

          set({ ..._initialState });
        },
      }),
      {
        name: "products-store",
        storage: createJSONStorage(() => persistentStorage),
      }
    ),
    { name: "products-store" }
  )
);
