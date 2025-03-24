import { api } from '@/service';
import { TObject } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IQueryOptions, TFetcherArgs } from './use-fetch-types';
import { useTranslation } from 'react-i18next';

async function fetcher<TData>({
  url,
  body,
  method = 'GET',
  params,
  onSuccess,
}: TFetcherArgs<TData>): Promise<TData> {
  const res = await api({
    method,
    params,
    data: body,
    url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (onSuccess) {
    onSuccess(res.data);
  }

  return res.data;
}

export const useFetch = <TData = TObject[], TError = AxiosError>({
  queryKey,
  url,
  body,
  method,
  params,
  queryOptions,
  onSuccess,
  dataKey,
  transformData,
}: IQueryOptions<TData, TError>) => {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: [queryKey, i18n.language, { body, params, onSuccess, transformData, dataKey }],
    queryFn: () => fetcher<TData>({ url, body, params, method, onSuccess }),
    ...queryOptions,
  });
};
