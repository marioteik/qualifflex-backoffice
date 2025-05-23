import { StateStorage } from "zustand/middleware";
import { flattenObject, unflattenObject } from "@/lib/utils/flatten-object";

function toQueryString(obj: Record<string, any>): string {
  const flattened = flattenObject(obj);
  return Object.entries(flattened)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

function fromQueryString(qs: string): Record<string, any> {
  const query = qs.startsWith("?") ? qs.slice(1) : qs;
  if (!query) return {};

  const pairs = query.split("&");
  const flatObj: Record<string, string> = {};

  for (const pair of pairs) {
    const [rawKey, rawVal] = pair.split("=");
    const key = decodeURIComponent(rawKey);
    const val = decodeURIComponent(rawVal || "");
    flatObj[key] = val;
  }

  return unflattenObject(flatObj);
}

function serializeToQueryString(value: string): string {
  const zustandState = JSON.parse(value);
  const { state } = zustandState;

  return toQueryString(state);
}

function deserializeFromQueryString(key: string): object {
  const params = new URLSearchParams(window.location.search);
  const storedValue = params.get(key);

  if (storedValue) {
    const qs = decodeURIComponent(storedValue);
    return fromQueryString(qs);
  }

  return {};
}

const persistentStorage: StateStorage = {
  getItem: (key) => {
    const localStorageState = localStorage.getItem(key);
    let state: { state?: object; version?: number } | null = null;

    if (localStorageState) {
      state = JSON.parse(localStorageState);
    }

    const queryStringState = deserializeFromQueryString(key);

    if (!state && !queryStringState) {
      return null;
    }

    if (queryStringState) {
      if (!state) {
        state = { state: queryStringState, version: 0 };
      } else {
        if (typeof state.state !== "object" || state.state === null) {
          state.state = {};
        }
        state.state = { ...state.state, ...queryStringState };
      }
    }

    return JSON.stringify(state);
  },
  setItem: (key, value) => {
    const queryString = serializeToQueryString(value);

    window.history.replaceState(
      {},
      "",
      `?${key}=${encodeURIComponent(queryString)}`,
    );
    localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);

    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, "", url.toString());
  },
};

export default persistentStorage;
