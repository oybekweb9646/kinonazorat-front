import { IUseFetchResponseList } from '@/shared/types';
import { useFetch } from '../use-fetch/use-fetch';
import { IProfile } from './use-profile-types';

export const useProfile = ({
  onSuccess = () => {},
  body = {},
  params = {},
  queryKey = 'profile',
  queryOptions = {},
} = {}) => {
  return useFetch<IUseFetchResponseList<IProfile>>({
    url: '/user/detail',
    queryKey,
    body,
    params,
    onSuccess,
    method: 'GET',
    queryOptions,
  });
};
