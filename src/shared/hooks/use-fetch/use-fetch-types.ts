import { TMethod } from '@/shared/types';
import { UseQueryOptions } from '@tanstack/react-query';

export type TFetcherArgs<TData> = {
  url: string;
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  method?: Extract<TMethod, 'GET' | 'POST'>;
  onSuccess?: (data: TData) => void;
};
export interface IQueryOptions<TData, TError> {
  queryKey: string | string[];
  url: string;
  dataKey?: TData | null;
  params?: Record<string, unknown>;
  method?: Extract<TMethod, 'GET' | 'POST'>;
  queryOptions?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>;
  body?: Record<string, unknown>;
  transformData?: (data: TData) => void;
  onSuccess?: (data: TData) => void;
}
