import { useTranslation } from 'react-i18next';
import AssessmentType from './components/AssessmentTypes';
import RatingList from './components/IndicatorsList';
import SearchForm from './components/SearchForm';
import useQuery from '@/shared/hooks/use-query/use-query';
import { useFetch } from '@/shared/hooks';
import { Spin } from 'antd';
import { useEffect } from 'react';

export default function StartAssessment() {
  const { t } = useTranslation();
  const { query, setQuery } = useQuery();

  const { data = {}, isFetching } = useFetch<any>({
    url: '/mib-integration/get',
    method: 'POST',
    queryKey: 'organization',
    body: {
      stir: query.stir,
    },
    queryOptions: {
      enabled: !!query.stir,
    },
  });

  const organizationData = data?.data;

  useEffect(() => {
    setQuery({
      ...query,
      authority_id: organizationData?.id,
      indicator_type_id: organizationData?.indicator_type_id,
      request_id: organizationData?.request_id,
    });
  }, [data]);

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='page-title !mb-2'>{t('Yaratish')}</h3>
      <SearchForm />
      <Spin spinning={isFetching}>
        {query.stir && organizationData?.id && (
          <AssessmentType organizationData={organizationData} />
        )}
        {query.indicator_type_id && query.request_id && query.authority_id && <RatingList />}
      </Spin>
    </div>
  );
}
