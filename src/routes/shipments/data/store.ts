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

export type ShipmentsRow = Row<any>["original"] | null;

interface State {
  openFile: (() => void) | null;
  setOpenFile: (openFile: () => void) => void;

  isEditOpen: boolean;
  setIsEditOpen: (isEditOpen: boolean) => void;

  isDeleteOpen: boolean;
  setIsDeleteOpen: (isDeleteOpen: boolean) => void;

  isDisableOpen: boolean;
  setIsDisableOpen: (isDisableOpen: boolean) => void;

  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (isDetailModalOpen: boolean) => void;

  selectedShipmentId: string | null;
  setSelectedShipmentId: (selectedShipmentId: string | null) => void;

  setIsClose: () => void;

  row: ShipmentsRow;
  setRow: (row: ShipmentsRow) => void;

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
  | "setIsDetailModalOpen"
  | "setSelectedShipmentId"
  | "setOpenFile"
  | "setPagination"
  | "resetStore"
>;

const initialState: InitialState = {
  openFile: null,
  isEditOpen: false,
  isDeleteOpen: false,
  isDisableOpen: false,
  isDetailModalOpen: false,
  selectedShipmentId: null,
  row: null,
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  sorting: [{ id: "issueDate", desc: true }],
  columnFilters: [],
  columnVisibility: {
    description: false,
    ops: false,
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

const pendingApprovalInitialState = {
  columnFilters: [
    {
      id: "status",
      value: "Pendente aprovação",
    },
  ],
};

const confirmedInitialState = {
  columnFilters: [
    {
      id: "status",
      value: "Confirmado",
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

const refusedInitialState = {
  columnFilters: [
    {
      id: "status",
      value: "Recusado",
    },
  ],
};

export const useShipmentsStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

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
            isDetailModalOpen: false,
            selectedShipmentId: null,
            row: null,
          }),

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

        setIsDetailModalOpen: (isDetailModalOpen) =>
          set((state) => ({
            isDetailModalOpen:
              typeof isDetailModalOpen === "boolean"
                ? isDetailModalOpen
                : !state.isDetailModalOpen,
          })),

        setSelectedShipmentId: (selectedShipmentId) =>
          set(() => ({ selectedShipmentId })),

        resetStore: (path) => {
          let _initialState: InitialState;

          switch (path) {
            case "pending":
              _initialState = {
                ...initialState,
                ...pendingInitialState,
              };
              break;
            case "pending-approval":
              _initialState = {
                ...initialState,
                ...pendingApprovalInitialState,
              };
              break;
            case "in-production":
              _initialState = {
                ...initialState,
                ...finishingInitialState,
              };
              break;
            case "confirmed":
              _initialState = {
                ...initialState,
                ...confirmedInitialState,
              };
              break;
            case "collected":
              _initialState = {
                ...initialState,
                ...collectedInitialState,
              };
              break;
            case "refused":
              _initialState = {
                ...initialState,
                ...refusedInitialState,
              };
              break;
            default:
              _initialState = { ...initialState };
          }

          set({ ..._initialState });
        },
      }),
      {
        name: "shipment-store",
        storage: createJSONStorage<State>(() => persistentStorage, {
          replacer: (key, value) => {
            if (key === "columnFilters") {
              value = (value as ColumnFiltersState).map((item) => {
                if (typeof item.value === "string") {
                  item.value = [item.value];
                }

                return item;
              });
            }

            return value;
          },
        }),
      }
    ),
    { name: "shipment-store" }
  )
);
