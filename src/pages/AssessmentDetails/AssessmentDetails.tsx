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
import OrderItems from './components/OrderItems';
import ActItems from './components/ActItems';

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
              {
                key: '2',
                label: <div className='font-bold text-lg'>{t("Buyruq ma'lumotlari")}</div>,
                children: <OrderItems request={request?.data} />,
                style: {
                  display:
                    request?.data?.order_number ||
                    request?.data?.order_date ||
                    request?.data?.order_file_id
                      ? 'block'
                      : 'none',
                },
              },
              {
                key: '3',
                label: (
                  <div className='font-bold text-lg'>{t("Tekshiruv natijasi ma'lumotlari")}</div>
                ),
                children: <ActItems request={request?.data} />,
                style: {
                  display:
                    request?.data?.act_number ||
                    request?.data?.act_date ||
                    request?.data?.act_file_id
                      ? 'block'
                      : 'none',
                },
              },
            ]}
            // defaultActiveKey={['1']}
          />
        </div>
      </Spin>
    </div>
  );
}
