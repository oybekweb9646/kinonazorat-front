import { useFetch } from '@/shared/hooks';
import { IUseFetchResponseList } from '@/shared/types';
import useQuery from '@/shared/hooks/use-query/use-query';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import { Badge, Card, Col, DatePicker, Input, Row, Select, Table, Tag } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Column } = Table;

interface IIntegrationLog {
  id: number;
  method: string;
  path: string;
  client_ip: string;
  token_valid: boolean;
  allowed: boolean;
  reason: string;
  status_code: number;
  user_agent: string;
  created_at: string;
}

interface ILogsData {
  items: IIntegrationLog[];
  meta: { page: number; per_page: number; total: number; last_page: number };
}

const reasonColor: Record<string, string> = {
  ok: 'green',
  invalid_token: 'red',
  ip_denied: 'orange',
  not_configured: 'default',
};

export default function IntegrationLogsTable() {
  const { t } = useTranslation();
  const { query } = useQuery();
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const { data, isFetching } = useFetch<IUseFetchResponseList<ILogsData>>({
    url: '/integration-admin/logs',
    method: 'POST',
    queryKey: 'integration-logs',
    params: { page: query.page || 1, size: query.page_size || 20 },
    body: filters,
  });

  const logs = data?.data;

  const reasonLabel: Record<string, string> = {
    ok: t('Ruxsat berildi'),
    invalid_token: t('Xato token'),
    ip_denied: t('IP rad etildi'),
    not_configured: t('Sozlanmagan'),
  };

  return (
    <Card title={t('Integratsiya loglari')} className='mt-4'>
      <Row gutter={8} className='mb-3'>
        <Col span={6}>
          <Input
            placeholder={t('IP manzil')}
            allowClear
            onChange={(e) => setFilters((p) => ({ ...p, client_ip: e.target.value || undefined }))}
          />
        </Col>
        <Col span={5}>
          <Select
            placeholder={t('Natija')}
            allowClear
            className='w-full'
            options={[
              { value: 'ok', label: t('Ruxsat berildi') },
              { value: 'invalid_token', label: t('Xato token') },
              { value: 'ip_denied', label: t('IP rad etildi') },
              { value: 'not_configured', label: t('Sozlanmagan') },
            ]}
            onChange={(v) => setFilters((p) => ({ ...p, reason: v || undefined }))}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder={t('Holat')}
            allowClear
            className='w-full'
            options={[
              { value: 'true', label: t('Ruxsat') },
              { value: 'false', label: t('Rad') },
            ]}
            onChange={(v) => setFilters((p) => ({ ...p, allowed: v ?? undefined }))}
          />
        </Col>
        <Col span={9}>
          <RangePicker
            className='w-full'
            onChange={(d) =>
              setFilters((p) => ({
                ...p,
                date_from: d?.[0]?.format('YYYY-MM-DD'),
                date_to: d?.[1]?.format('YYYY-MM-DD'),
              }))
            }
          />
        </Col>
      </Row>

      <Table
        bordered
        size='small'
        dataSource={logs?.items}
        rowKey='id'
        loading={isFetching}
        pagination={false}
        scroll={{ x: 'max-content' }}
        footer={() => <Pagination total={logs?.meta?.total} currentPage={logs?.meta?.page} align='end' />}
      >
        <Column title='ID' dataIndex='id' width={60} align='center' />
        <Column
          title={t('Sana')}
          dataIndex='created_at'
          width={160}
          render={(v) => (v ? dayjs(v).format('DD.MM.YYYY HH:mm:ss') : '-')}
        />
        <Column title={t('Metod')} dataIndex='method' align='center' width={70} render={(m) => <Tag>{m}</Tag>} />
        <Column title={t("Yo'l")} dataIndex='path' />
        <Column title={t('IP manzil')} dataIndex='client_ip' width={150} />
        <Column
          title={t('Natija')}
          dataIndex='reason'
          align='center'
          width={140}
          render={(r) => <Tag color={reasonColor[r] || 'default'}>{reasonLabel[r] || r}</Tag>}
        />
        <Column
          title={t('Holat')}
          dataIndex='status_code'
          align='center'
          width={90}
          render={(c, row: IIntegrationLog) => (
            <Badge status={row.allowed ? 'success' : 'error'} text={c ?? 200} />
          )}
        />
      </Table>
    </Card>
  );
}
