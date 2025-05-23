import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  ColumnFiltersState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type { Driver } from "@/schemas/driver";
import type { SelectRoute } from "@/schemas/routes";

interface State {
  drivers: Driver[];
  setDrivers: (drivers: Driver[]) => void;
  markStopAsPickedUp: (driverId: string, stopId: string) => void;

  openFile: (() => void) | null;
  setOpenFile: (openFile: () => void) => void;

  isEditOpen: boolean;
  setIsEditOpen: (isEditOpen: boolean) => void;

  isDeleteOpen: boolean;
  setIsDeleteOpen: (isDeleteOpen: boolean) => void;

  isDisableOpen: boolean;
  setIsDisableOpen: (isDisableOpen: boolean) => void;

  setIsClose: () => void;

  row: Row<SelectRoute>["original"] | null;
  setRow: (row: Row<SelectRoute>["original"]) => void;

  pagination: PaginationState;
  setPagination: (
    pagination: PaginationState | ((old: PaginationState) => PaginationState)
  ) => void;

  sorting: { id: string; desc: boolean }[];
  setSorting: (
    sorting: SortingState | ((old: SortingState) => SortingState)
  ) => void;

  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    filters:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => void;

  columnVisibility: VisibilityState;
  setColumnVisibility: (
    visibility: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void;

  rowSelection: RowSelectionState;
  setRowSelection: (
    rowSelection:
      | RowSelectionState
      | ((old: RowSelectionState) => RowSelectionState)
  ) => void;

  resetStore: (path: string) => void;
}

type InitialState = Omit<
  State,
  | "setColumnVisibility"
  | "setColumnFilters"
  | "setRow"
  | "setIsClose"
  | "setSorting"
  | "setIsDeleteOpen"
  | "setIsDisableOpen"
  | "setIsEditOpen"
  | "setOpenFile"
  | "setPagination"
  | "resetStore"
  | "setDrivers"
  | "markStopAsPickedUp"
  | "setRowSelection"
>;

const initialState: InitialState = {
  drivers: [],
  openFile: null,
  isEditOpen: false,
  isDeleteOpen: false,
  isDisableOpen: false,
  row: null,
  rowSelection: {},
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  sorting: [{ id: "status", desc: true }],
  columnFilters: [
    {
      id: "status",
      value: ["Confirmado", "Finalizado"],
    },
  ],
  columnVisibility: {
    createdAt: false,
  },
};

const pendingInitialState = {
  columnFilters: [
    {
      id: "status",
      value: "Pendente",
    },
  ],
};

const finishingInitialState = {
  columnFilters: [
    {
      id: "status",
      value: "Produzindo",
    },
  ],
};

const collectedInitialState = {
  columnFilters: [
    {
      id: "status",
      value: "Coletado",
    },
  ],
};

export const useLoadListStore = create<State>()(
  devtools(
    (set) => ({
      ...initialState,

      setDrivers: (drivers) => set({ drivers }),
      markStopAsPickedUp: (driverId, stopId) =>
        set((state) => {
          const updatedDrivers = state.drivers.map((driver) => {
            if (driver.id === driverId) {
              return {
                ...driver,
                stops: driver.stops.map((stop) =>
                  stop.id === stopId ? { ...stop, status: "PICKED_UP" } : stop
                ),
              };
            }
            return driver;
          });

          return { drivers: updatedDrivers };
        }),

      setRow: (row) => set(() => ({ row })),
      setOpenFile: (openFile) => set(() => ({ openFile })),

      setIsEditOpen: (isEditOpen) =>
        set((state) => ({
          isEditOpen:
            typeof isEditOpen === "boolean" ? isEditOpen : !state.isEditOpen,
        })),

      setIsDeleteOpen: (isDeleteOpen) =>
        set((state) => ({
          isDeleteOpen:
            typeof isDeleteOpen === "boolean"
              ? isDeleteOpen
              : !state.isDeleteOpen,
        })),

      setIsDisableOpen: (isDisableOpen) =>
        set((state) => ({
          isDisableOpen:
            typeof isDisableOpen === "boolean"
              ? isDisableOpen
              : !state.isDisableOpen,
        })),

      setIsClose: () =>
        set({
          isDeleteOpen: false,
          isEditOpen: false,
          isDisableOpen: false,
          row: null,
        }),

      // Table state setters
      setRowSelection: (rowSelection) =>
        set((state) => ({
          rowSelection:
            typeof rowSelection === "function"
              ? rowSelection(state.rowSelection)
              : rowSelection,
        })),

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

      resetStore: (path) => {
        let _initialState: InitialState;

        switch (path) {
          case "pending":
            _initialState = {
              ...initialState,
              ...pendingInitialState,
            };
            break;
          case "in-production":
            _initialState = {
              ...initialState,
              ...finishingInitialState,
            };
            break;
          case "collected":
            _initialState = {
              ...initialState,
              ...collectedInitialState,
            };
            break;
          default:
            _initialState = { ...initialState };
        }

        set({ ..._initialState });
      },
    }),
    { name: "shipment-store" }
  )
);
