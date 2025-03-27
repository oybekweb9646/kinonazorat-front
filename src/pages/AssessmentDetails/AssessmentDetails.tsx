import { JSX, useEffect } from 'react';
import MainInfo from './components/MainInfo';
import IndicatorsList from './components/IndicatorsList';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponseList } from '@/shared/types';
import { Button, Collapse, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Logs from './components/Logs';

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
      <div className='flex gap-4'>
        <Link to={'/assessment-results'}>
          <Button icon={<LeftOutlined />} />
        </Link>
        <h3 className='page-title'>{t("Baholash ma'lumotlari")}</h3>
      </div>
      <Spin spinning={isFetching}>
        <div className='flex flex-col gap-4'>
          <MainInfo data={request?.data} />
          <IndicatorsList request={request} />
          <Collapse
            bordered={false}
            items={[
              {
                key: '1',
                label: <div className='font-bold text-lg'>{t('Jarayonlar tarixi')}</div>,
                children: <Logs />,
              },
            ]}
            // defaultActiveKey={['1']}
          />
        </div>
      </Spin>
    </div>
  );
}
