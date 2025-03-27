import { JSX } from 'react';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/shared/hooks';
import { IUseFetchResponse } from '@/shared/types';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ACTIONS_LIST } from '@/service';
const { Column } = Table;

export default function Logs(): JSX.Element {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, isFetching } = useFetch<IUseFetchResponse<any>>({
    url: `/request/log/${id}`,
    method: 'GET',
    queryKey: 'action-logs',
  });

  const formatValue = (value: string | number) => {
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      return dayjs(value).format('DD.MM.YYYY HH:mm:ss');
    }
    return value;
  };

  return (
    <Table
      bordered
      dataSource={data?.data || []}
      pagination={false}
      rowHoverable={false}
      loading={isFetching}
    >
      <Column align='center' title={t('ID')} dataIndex={'id'} />
      <Column
        title={t('Harakat')}
        dataIndex='action'
        render={(action) => {
          const currentAction = ACTIONS_LIST.find((item) => item.id === action);
          const actionName = t(currentAction?.name || '') || action;
          return actionName.toUpperCase();
        }}
      />
      <Column
        title={t('Vaqt')}
        dataIndex='created_at'
        align='center'
        render={(date) => dayjs(date).format('DD.MM.YYYY HH:mm:ss')}
      />
      <Column
        align='center'
        title={t('Foydalanuvchi')}
        dataIndex='user'
        render={(user) => user?.full_name || user.username}
      />
      <Column
        align='center'
        title={t('Eski qiymat')}
        className='bg-red-200'
        render={(item) => {
          const parsedData = JSON.parse(item?.data || '{}');

          return Object.entries(parsedData).map(([fieldName, value]: any) => (
            <div>
              <div className='!font-mono italic'>{fieldName}</div>
              <div className='font-bold'>{formatValue(value.old) || '-'}</div>
            </div>
          ));
        }}
      />
      <Column
        align='center'
        title={t('Yangi qiymat')}
        className='bg-green-200'
        render={(item) => {
          const parsedData = JSON.parse(item?.data || '{}');

          return Object.entries(parsedData).map(([fieldName, value]: any) => (
            <div>
              <div className='!font-mono italic'>{fieldName}</div>
              <div className='font-bold'>{formatValue(value?.new) || '-'}</div>
            </div>
          ));
        }}
      />
    </Table>
  );
}
