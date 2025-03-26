import { JSX, useEffect } from 'react';
import MainInfo from './components/MainInfo';
import IndicatorsList from './components/IndicatorsList';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponseList } from '@/shared/types';
import { Spin } from 'antd';

export default function AssessmentDetails(): JSX.Element {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    data: request,
    isFetching,
    refetch,
  } = useFetch<IUseFetchResponseList<any>>({
    url: `/request/get/${id}`,
    method: 'GET',
    queryKey: 'request',
    queryOptions: {
      enabled: !!id,
    },
  });

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  return (
    <div>
      <h3 className='page-title'>{t("Baholash ma'lumotlari")}</h3>
      <Spin spinning={isFetching}>
        <div className='flex flex-col gap-4'>
          <MainInfo data={request?.data} />
          <IndicatorsList request={request} />
        </div>
      </Spin>
    </div>
  );
}
