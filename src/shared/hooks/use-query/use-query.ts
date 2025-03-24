import { useSearchParams } from "react-router-dom";
import qs from "qs";

interface QueryParams {
  [key: string]: string | string[] | undefined | number | object;
}

export default function useQuery() {
  const [, setSearchParams] = useSearchParams();

  const query: QueryParams = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });

  const setQuery = (
    params: QueryParams = {},
    keepPreviousQuery: boolean = true
  ) => {
    Object.entries(params).forEach(([key, value]) => {
      if (!value) {
        delete query[key];
        delete params[key];
      }
    });

    const mergedData: QueryParams = keepPreviousQuery
      ? { ...query, ...params }
      : { ...params };

    // Use qs.stringify to convert mergedData to a query string
    const queryString = qs.stringify(mergedData, { skipNulls: true });
    setSearchParams(queryString, { replace: true });
  };

  return {
    query,
    setQuery,
  };
}
