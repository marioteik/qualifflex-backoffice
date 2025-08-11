export type QueryOptions<T = void> = {
  onError?: (err: Error) => void;
  onSuccess?: (result?: T) => void;
};
