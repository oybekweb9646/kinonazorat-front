import { useFetch } from '@/shared/hooks';
import { IUseFetchResponseList } from '@/shared/types';
import { Card, Col, Row, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import IntegrationSettingsCard from './components/IntegrationSettingsCard';
import IntegrationLogsTable from './components/IntegrationLogsTable';

interface ILogStats {
  total: number;
  allowed: number;
  denied: number;
  today: number;
}

export default function Integration() {
  const { t } = useTranslation();

  const { data: stats } = useFetch<IUseFetchResponseList<ILogStats>>({
    url: '/integration-admin/logs/stats',
    method: 'GET',
    queryKey: 'integration-log-stats',
  });

  const s = stats?.data;

  return (
    <div>
      <h3 className='page-title mb-4'>{t('MSPD integratsiyasi')}</h3>

      <Row gutter={16} className='mb-4'>
        <Col span={6}>
          <Card>
            <Statistic title={t("Jami so'rovlar")} value={s?.total ?? 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={t('Ruxsat berilgan')} value={s?.allowed ?? 0} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={t('Rad etilgan')} value={s?.denied ?? 0} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={t('Bugun')} value={s?.today ?? 0} />
          </Card>
        </Col>
      </Row>

      <IntegrationSettingsCard />
      <IntegrationLogsTable />
    </div>
  );
}
