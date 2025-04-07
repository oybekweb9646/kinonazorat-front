import { Table } from 'antd';
import { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
const { Column } = Table;

import { FormStateTypes, IUseFetchResponse } from '@/shared/types';
import IndicatorsList from './components/IndicatorsList';
import { useFetch } from '@/shared/hooks';
import { PARTLY_SCORED } from '@/service';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import useQuery from '@/shared/hooks/use-query/use-query';
import AssessmentFilters from '@/shared/components/AssessmentFilters';

export default function OngoingAssessments(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<FormStateTypes>({
    open: false,
    type: 'create',
    item: null,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { query } = useQuery();

  const { data, isFetching } = useFetch<IUseFetchResponse<any>>({
    url: '/request/filter',
    method: 'POST',
    queryKey: ['ongoing-assessments'],
    body: {
      status: PARTLY_SCORED,
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
      <h3 className='page-title'>{t('Jarayondagi baholashlar')}</h3>
      <AssessmentFilters />
      <Table
        bordered
        loading={isFetching}
        dataSource={data?.data || []}
        pagination={false}
        footer={() => (
          <Pagination total={data?.total} currentPage={data?.current_page} align='end' />
        )}
        onRow={(record) => {
          return {
            onClick: () =>
              navigate(
                `/start-assessments?stir=${record.stir}&request_id=${record.id}&indicator_type_id=${record.indicator_type_id}`,
              ),
            className: 'cursor-pointer',
          };
        }}
      >
        <Column title={t('ID')} dataIndex={'id'} align='center' />
        <Column title={t('Tashkilot nomi')} render={(item) => item?.authority?.name} />
        <Column
          title={t('Yaratuvchisi')}
          align='center'
          dataIndex='created_by'
          render={(item) => item?.full_name || item?.username}
        />
        <Column title={t('Stir')} dataIndex='stir' key='stir' align='center' />
        <Column
          title={t("Ko'rsatkich turi")}
          render={(item) => item?.indicator_type?.name}
          align='center'
        />
      </Table>

      {isModalOpen.open && (
        <IndicatorsList
          open={isModalOpen.open}
          type={isModalOpen.type}
          item={isModalOpen.item}
          onCancel={() => setIsModalOpen({ open: false })}
        />
      )}
    </div>
  );
}
