import { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Card, Col, DatePicker, Input, Row, Select, Table, Tabs, Tag } from 'antd';
import ExportButtons from '@/shared/components/ExportButtons/ExportButtons';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponse, IUseFetchResponseList } from '@/shared/types';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import useQuery from '@/shared/hooks/use-query/use-query';
import dayjs from 'dayjs';

const { Column } = Table;
const { RangePicker } = DatePicker;

interface IActivityLog {
  id: number;
  user_id: number | null;
  username: string | null;
  user_role: number | null;
  method: string;
  url: string;
  action: string | null;
  request_data: any;
  ip_address: string | null;
  status_code: number | null;
  created_at: string;
}

interface IErrorLog {
  id: number;
  user_id: number | null;
  username: string | null;
  user_role: number | null;
  method: string | null;
  url: string | null;
  message: string;
  exception_class: string | null;
  file: string | null;
  line: number | null;
  ip_address: string | null;
  status_code: number | null;
  created_at: string;
}

interface IStats {
  total: number;
  today: number;
  errors_today: number;
  total_errors: number;
}

function methodColor(method: string | null) {
  const colors: Record<string, string> = {
    POST: 'blue',
    GET: 'green',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
  };
  return colors[method ?? ''] ?? 'default';
}

function statusColor(code: number | null) {
  if (!code) return 'default';
  if (code < 300) return 'success';
  if (code < 400) return 'warning';
  return 'error';
}

export default function Monitoring(): JSX.Element {
  const { t } = useTranslation();
  const { query, setQuery } = useQuery();

  const [activityFilters, setActivityFilters] = useState<any>({});
  const [errorFilters, setErrorFilters] = useState<any>({});

  const { data: stats } = useFetch<IUseFetchResponseList<IStats>>({
    url: '/logs/stats',
    method: 'GET',
    queryKey: 'log-stats',
  });

  const { data: activityLogs, isFetching: activityLoading } = useFetch<IUseFetchResponse<IActivityLog[]>>({
    url: '/logs/activity',
    method: 'POST',
    queryKey: 'activity-logs',
    params: { page: query.page || 1, size: query.page_size || 30 },
    body: activityFilters,
  });

  const { data: errorLogs, isFetching: errorLoading } = useFetch<IUseFetchResponse<IErrorLog[]>>({
    url: '/logs/errors',
    method: 'POST',
    queryKey: 'error-logs',
    params: { page: query.page || 1, size: query.page_size || 30 },
    body: errorFilters,
  });

  const statsData = stats?.data;

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='page-title'>{t('Monitoring')}</h3>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-700'>{statsData?.total ?? 0}</div>
              <div className='text-gray-500 text-sm'>{t("Jami amallar")}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>{statsData?.today ?? 0}</div>
              <div className='text-gray-500 text-sm'>{t("Bugungi amallar")}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className='text-center'>
              <div className='text-2xl font-bold text-red-500'>{statsData?.total_errors ?? 0}</div>
              <div className='text-gray-500 text-sm'>{t("Jami xatoliklar")}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-500'>{statsData?.errors_today ?? 0}</div>
              <div className='text-gray-500 text-sm'>{t("Bugungi xatoliklar")}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey='activity'
        onChange={() => setQuery({ page: 1 })}
        items={[
          {
            key: 'activity',
            label: (
              <span>
                {t('Amallar tarixi')}
                <Badge count={statsData?.total ?? 0} className='ml-2' color='blue' />
              </span>
            ),
            children: (
              <div className='flex flex-col gap-3'>
                <div className='flex justify-end'>
                  <ExportButtons
                    data={activityLogs?.data ?? []}
                    filename='amallar-tarixi'
                    title='Amallar tarixi'
                    columns={[
                      { title: 'ID', dataIndex: 'id' },
                      { title: t('Sana'), render: (item) => dayjs(item.created_at).format('DD.MM.YYYY HH:mm:ss') },
                      { title: t('Foydalanuvchi'), dataIndex: 'username' },
                      { title: t('Metod'), dataIndex: 'method' },
                      { title: t('Amal'), dataIndex: 'action' },
                      { title: 'URL', dataIndex: 'url' },
                      { title: t('Status'), dataIndex: 'status_code' },
                      { title: 'IP', dataIndex: 'ip_address' },
                    ]}
                  />
                </div>
                <Row gutter={8}>
                  <Col span={6}>
                    <Input
                      placeholder={t('Foydalanuvchi')}
                      allowClear
                      onChange={(e) => setActivityFilters((p: any) => ({ ...p, action: e.target.value || undefined }))}
                    />
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder={t('Metod')}
                      allowClear
                      className='w-full'
                      options={['POST', 'GET', 'PUT', 'DELETE', 'PATCH'].map((m) => ({ value: m, label: m }))}
                      onChange={(v) => setActivityFilters((p: any) => ({ ...p, method_filter: v || undefined }))}
                    />
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder={t('Status')}
                      allowClear
                      className='w-full'
                      options={[
                        { value: 200, label: '200 OK' },
                        { value: 400, label: '400 Bad Request' },
                        { value: 401, label: '401 Unauthorized' },
                        { value: 403, label: '403 Forbidden' },
                        { value: 500, label: '500 Server Error' },
                      ]}
                      onChange={(v) => setActivityFilters((p: any) => ({ ...p, status_code: v || undefined }))}
                    />
                  </Col>
                  <Col span={10}>
                    <RangePicker
                      className='w-full'
                      onChange={(dates) =>
                        setActivityFilters((p: any) => ({
                          ...p,
                          date_from: dates?.[0]?.format('YYYY-MM-DD'),
                          date_to: dates?.[1]?.format('YYYY-MM-DD'),
                        }))
                      }
                    />
                  </Col>
                </Row>

                <Table
                  bordered
                  size='small'
                  dataSource={activityLogs?.data}
                  rowKey='id'
                  loading={activityLoading}
                  pagination={false}
                  footer={() => (
                    <Pagination total={activityLogs?.total} currentPage={activityLogs?.current_page} align='end' />
                  )}
                >
                  <Column title='ID' dataIndex='id' width={60} align='center' />
                  <Column
                    title={t('Sana')}
                    dataIndex='created_at'
                    width={150}
                    render={(v) => dayjs(v).format('DD.MM.YYYY HH:mm:ss')}
                  />
                  <Column title={t('Foydalanuvchi')} dataIndex='username' />
                  <Column
                    title={t('Metod')}
                    dataIndex='method'
                    align='center'
                    width={80}
                    render={(m) => <Tag color={methodColor(m)}>{m}</Tag>}
                  />
                  <Column title={t('Amal')} dataIndex='action' />
                  <Column title='URL' dataIndex='url' />
                  <Column
                    title={t('Status')}
                    dataIndex='status_code'
                    align='center'
                    width={80}
                    render={(code) => <Badge status={statusColor(code) as any} text={code} />}
                  />
                  <Column title='IP' dataIndex='ip_address' align='center' width={120} />
                </Table>
              </div>
            ),
          },
          {
            key: 'errors',
            label: (
              <span>
                {t('Xatoliklar')}
                <Badge count={statsData?.total_errors ?? 0} className='ml-2' color='red' />
              </span>
            ),
            children: (
              <div className='flex flex-col gap-3'>
                <div className='flex justify-end'>
                  <ExportButtons
                    data={errorLogs?.data ?? []}
                    filename='xatoliklar'
                    title='Xatoliklar'
                    columns={[
                      { title: 'ID', dataIndex: 'id' },
                      { title: t('Sana'), render: (item) => dayjs(item.created_at).format('DD.MM.YYYY HH:mm:ss') },
                      { title: t('Foydalanuvchi'), dataIndex: 'username' },
                      { title: 'URL', dataIndex: 'url' },
                      { title: t('Xabar'), dataIndex: 'message' },
                      { title: t('Status'), dataIndex: 'status_code' },
                      { title: 'IP', dataIndex: 'ip_address' },
                    ]}
                  />
                </div>
                <Row gutter={8}>
                  <Col span={8}>
                    <Input
                      placeholder={t('Xabar matni')}
                      allowClear
                      onChange={(e) => setErrorFilters((p: any) => ({ ...p, message: e.target.value || undefined }))}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      placeholder='URL'
                      allowClear
                      onChange={(e) => setErrorFilters((p: any) => ({ ...p, url: e.target.value || undefined }))}
                    />
                  </Col>
                  <Col span={10}>
                    <RangePicker
                      className='w-full'
                      onChange={(dates) =>
                        setErrorFilters((p: any) => ({
                          ...p,
                          date_from: dates?.[0]?.format('YYYY-MM-DD'),
                          date_to: dates?.[1]?.format('YYYY-MM-DD'),
                        }))
                      }
                    />
                  </Col>
                </Row>

                <Table
                  bordered
                  size='small'
                  dataSource={errorLogs?.data}
                  rowKey='id'
                  loading={errorLoading}
                  pagination={false}
                  footer={() => (
                    <Pagination total={errorLogs?.total} currentPage={errorLogs?.current_page} align='end' />
                  )}
                  expandable={{
                    expandedRowRender: (record: IErrorLog) => (
                      <div className='text-xs p-2'>
                        <div><strong>Fayl:</strong> {record.file}:{record.line}</div>
                        <div><strong>Exception:</strong> {record.exception_class}</div>
                      </div>
                    ),
                  }}
                >
                  <Column title='ID' dataIndex='id' width={60} align='center' />
                  <Column
                    title={t('Sana')}
                    dataIndex='created_at'
                    width={150}
                    render={(v) => dayjs(v).format('DD.MM.YYYY HH:mm:ss')}
                  />
                  <Column title={t('Foydalanuvchi')} dataIndex='username' />
                  <Column
                    title={t('Metod')}
                    dataIndex='method'
                    align='center'
                    width={80}
                    render={(m) => m && <Tag color={methodColor(m)}>{m}</Tag>}
                  />
                  <Column title='URL' dataIndex='url' />
                  <Column
                    title={t('Xabar')}
                    dataIndex='message'
                    render={(msg) => (
                      <span className='text-red-600 text-xs' title={msg}>
                        {msg?.length > 80 ? msg.slice(0, 80) + '...' : msg}
                      </span>
                    )}
                  />
                  <Column
                    title={t('Status')}
                    dataIndex='status_code'
                    align='center'
                    width={80}
                    render={(code) => <Tag color='red'>{code ?? 500}</Tag>}
                  />
                  <Column title='IP' dataIndex='ip_address' align='center' width={120} />
                </Table>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}