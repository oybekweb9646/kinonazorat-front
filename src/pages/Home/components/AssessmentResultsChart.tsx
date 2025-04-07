import { Card } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import Highcharts from 'highcharts';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HighchartsReact from 'highcharts-react-official';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponseList } from '@/shared/types';
import { TFunction } from 'i18next';
import { HIGH_RISK_COLOR, LOW_RISK_COLOR, MEDIUM_RISK_COLOR } from '@/service';

function generateOptions(data: { high: number; low: number; normal: number }, t: TFunction) {
  return {
    chart: {
      type: 'pie',
      height: 300,
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      backgroundColor: 'transparent',
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            fontSize: '12px',
          },
        },
        showInLegend: false,
        depth: 45,
      },
    },
    series: [
      {
        name: t('Baholash natijasi'),
        colorByPoint: true,
        data: [
          {
            name: t('Xavfi past'),
            y: data?.low,
            color: LOW_RISK_COLOR,
          },
          {
            name: t("Xavfi o'rta"),
            y: data?.normal,
            color: MEDIUM_RISK_COLOR,
          },
          {
            name: t('Xavfi yuqori'),
            y: data?.high,
            color: HIGH_RISK_COLOR,
          },
        ],
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>', // Show percentage in tooltip
    },
  };
}
const AssessmentResultsChart = (): JSX.Element => {
  const { t } = useTranslation();

  const { data } = useFetch<IUseFetchResponseList<any>>({
    url: '/request/stat',
    method: 'GET',
    queryKey: ['assessment-results'],
  });

  return (
    <Card title={t('Baholash natijalari')}>
      <HighchartsReact highcharts={Highcharts} options={generateOptions(data?.data, t)} />
    </Card>
  );
};

export default AssessmentResultsChart;
