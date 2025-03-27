import { Table } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
const { Column } = Table;
import AssessmentFilters from '@/shared/components/AssessmentFilters';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponse } from '@/shared/types';
import { handleAssessmentColor, SCORED } from '@/service';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import dayjs from 'dayjs';
import useQuery from '@/shared/hooks/use-query/use-query';

export default function AssessmentResults(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { query } = useQuery();

  const { data, isFetching } = useFetch<IUseFetchResponse<any>>({
    url: '/request/filter',
    method: 'POST',
    queryKey: 'ongoing-assessments',
    body: {
      status: SCORED,
      stir: query.stir,
      id: query.id,
      authority_id: query.authority_id,
      created_by: query.created_by,
    },
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
  });

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='page-title'>{t('Baholash natijalari')}</h3>
      <AssessmentFilters />

      <Table
        bordered
        dataSource={data?.data}
        rowHoverable={false}
        loading={isFetching}
        pagination={false}
        rowClassName={'cursor-pointer'}
        footer={() => (
          <Pagination total={data?.total} currentPage={data?.current_page} align='end' />
        )}
        onRow={(record) => {
          return {
            style: {
              backgroundColor: handleAssessmentColor(record.score),
            },
            onClick: () => {
              navigate(`/assessment-details/${record.id}`);
            },
          };
        }}
      >
        <Column title={t('ID')} dataIndex={'id'} align='center' />
        <Column title={t('Tashkilot nomi')} render={(item) => item.authority?.name} />
        <Column
          title={t('Manzil')}
          render={(item) =>
            item?.authority?.address ||
            item?.authority?.billing_address ||
            item?.authority?.director_address
          }
        />
        <Column
          title={t('Yaratuvchisi')}
          dataIndex='created_by'
          align='center'
          render={(createdBy) => createdBy.username}
        />
        <Column title={t('Stir')} dataIndex='stir' key='stir' align='center' />
        <Column
          title={t("Ko'rsatkich turi")}
          render={(item) => item.indicator_type.name}
          align='center'
        />
        <Column
          title={t('Yakunlangan sana')}
          dataIndex='closed_at'
          align='center'
          render={(closedAt) => dayjs(closedAt).format('DD.MM.YYYY')}
        />
        <Column title={t('Ball')} dataIndex='score' key='score' align='center' />
      </Table>
    </div>
  );
}
