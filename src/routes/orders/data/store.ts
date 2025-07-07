import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import type {
  ColumnFiltersState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import persistentStorage from "@/stores/persist-storage";
import type { SelectOrder } from "@/schemas/orders";

export type OrdersRow = Row<SelectOrder>["original"] | null;

interface State {
  // Modals or other UI states
  isEditOpen: boolean;
  setIsEditOpen: (value: boolean) => void;

  isDeleteOpen: boolean;
  setIsDeleteOpen: (value: boolean) => void;

  isDisableOpen: boolean;
  setIsDisableOpen: (value: boolean) => void;

  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (isDetailModalOpen: boolean) => void;

  selectedOrderId: string | null;
  setSelectedOrderId: (selectedOrderId: string | null) => void;

  setIsClose: () => void;

  row: RowSelectionState;
  setRow: (
    value: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => void;

  // Table state
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

  resetStore: (path?: string) => void; // If you want to handle path-based filters
}

type InitialState = Omit<
  State,
  | "setIsEditOpen"
  | "setIsDeleteOpen"
  | "setIsDisableOpen"
  | "setIsDetailModalOpen"
  | "setSelectedOrderId"
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
  isDetailModalOpen: false,
  selectedOrderId: null,
  row: {},
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  sorting: [{ id: "codeReference", desc: false }],
  columnFilters: [],
  columnVisibility: {},
};

export const useOrdersStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setIsEditOpen: (isEditOpen) => set(() => ({ isEditOpen })),
        setIsDeleteOpen: (isDeleteOpen) => set(() => ({ isDeleteOpen })),
        setIsDisableOpen: (isDisableOpen) => set(() => ({ isDisableOpen })),

        setIsDetailModalOpen: (isDetailModalOpen) =>
          set((state) => ({
            isDetailModalOpen:
              typeof isDetailModalOpen === "boolean"
                ? isDetailModalOpen
                : !state.isDetailModalOpen,
          })),

        setSelectedOrderId: (selectedOrderId) =>
          set(() => ({ selectedOrderId })),

        setIsClose: () =>
          set({
            isEditOpen: false,
            isDeleteOpen: false,
            isDisableOpen: false,
            isDetailModalOpen: false,
            selectedOrderId: null,
            row: {},
          }),

        setRow: (row) => set(() => ({ row })),

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
        name: "orders-store",
        storage: createJSONStorage(() => persistentStorage),
      }
    ),
    { name: "orders-store" }
  )
);
