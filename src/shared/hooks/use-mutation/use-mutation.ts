import { api } from '@/service';
import { useMutation as _useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TMutationFnArgs, TUseMutationOptions } from './use-mutation-types';

const mutationFn = async <TData>({ url, method = 'POST', data, params, headers }: TMutationFnArgs): Promise<TData> => {
  const res = await api({
    data,
    url,
    params,
    method,
    headers,
  });
  return res.data;
};

export const useMutation = <TData = unknown, TError = AxiosError, TContext = unknown>({
  mutationKey,
  options,
}: TUseMutationOptions<TData, TError, TMutationFnArgs, TContext>): UseMutationResult<
  TData,
  TError,
  TMutationFnArgs,
  TContext
> => {
  return _useMutation({
    mutationKey: [mutationKey],
    mutationFn: (variables: TMutationFnArgs) => mutationFn<TData>(variables),
    ...options,
  });
};
