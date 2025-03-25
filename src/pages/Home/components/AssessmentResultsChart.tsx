import { Card } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponseList } from '@/shared/types';
import { TFunction } from 'i18next';

function generateOptions(data: { high: number; danger: number; normal: number }, t: TFunction) {
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
            name: t('Xavfli'),
            y: data?.danger,
            color: '#F88379',
          },
          {
            name: t("O'rtacha"),
            y: data?.normal,
            color: '#E4D96F',
          },
          {
            name: t('Yuqori'),
            y: data?.high,
            color: '#00FF99',
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
