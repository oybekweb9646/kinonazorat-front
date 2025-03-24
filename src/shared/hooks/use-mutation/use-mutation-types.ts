import { TMethod } from '@/shared/types';
import { MutationKey, UseMutationOptions } from '@tanstack/react-query';
import { RawAxiosRequestHeaders } from 'axios';

export type TUseMutationOptions<TData, TError, TVariables, TContext> = {
  mutationKey: string | MutationKey;
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationKey' | 'mutationFn'>;
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void;
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
};

export type TMutationFnArgs = {
  url: string;
  data?: Record<string, unknown> | FormData;
  method?: Extract<TMethod, 'POST' | 'PUT' | 'DELETE' | 'GET'>;
  params?: Record<string, unknown>;
  headers?: RawAxiosRequestHeaders;
};
