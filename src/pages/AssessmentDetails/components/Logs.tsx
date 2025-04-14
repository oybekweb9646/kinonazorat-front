import { JSX } from 'react';
import { Popover, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponse } from '@/shared/types';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ACTIONS_LIST, ASSESSMENT_STATUSES_LIST } from '@/service';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import useQuery from '@/shared/hooks/use-query/use-query';
const { Column } = Table;

export default function Logs(): JSX.Element {
  const { t } = useTranslation();
  const { query } = useQuery();
  const { id } = useParams();
  const { data, isFetching } = useFetch<IUseFetchResponse<any>>({
    url: `/request/log/${id}`,
    method: 'GET',
    queryKey: 'action-logs',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
  });

  const isDateString = (value: string) => {
    const date: any = new Date(value);
    return !isNaN(date) && date.toString() !== 'Invalid Date';
  };

  const formatValue = (value: string | number, fieldName: string) => {
    if (typeof value === 'string' && isDateString(value)) {
      return dayjs(value).format('DD.MM.YYYY HH:mm:ss');
    }

    if (fieldName === 'status') {
      const currentStatus = ASSESSMENT_STATUSES_LIST.find((item) => item.id === value);
      return t(currentStatus?.name || '') || value;
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
      footer={() => {
        return <Pagination total={data?.total} currentPage={data?.current_page} align='end' />;
      }}
    >
      {/* <Column align='center' title={t('ID')} dataIndex={'id'} /> */}
      <Column
        title={t('Harakat')}
        render={(log) => {
          const currentAction = ACTIONS_LIST.find((item) => item.id === log.action);
          const actionName = t(currentAction?.name || '') || log.action;

          return (
            <div>
              {actionName.toUpperCase()}
              {log?.score_request_indicator?.indicator?.name && (
                <Popover
                  title={t("Ko'rsatkich nomi")}
                  content={log?.score_request_indicator?.indicator?.name}
                  trigger='click'
                  overlayStyle={{ width: 300 }}
                >
                  <InfoCircleOutlined style={{ marginLeft: '5px', color: '#1890ff' }} />
                </Popover>
              )}
            </div>
          );
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
              <div className='!font-mono italic'>{t(fieldName)}</div>
              <div className='font-bold'>{formatValue(value.old, fieldName) || '-'}</div>
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
              <div className='!font-mono italic'>{t(fieldName)}</div>
              <div className='font-bold'>{formatValue(value?.new, fieldName) || '-'}</div>
            </div>
          ));
        }}
      />
    </Table>
  );
}
