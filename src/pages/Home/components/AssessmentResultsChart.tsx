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
          format: '{point.labelOnly}', // Faqat nom chiqadi
          style: {
            fontSize: '12px',
          },
        },
        showInLegend: true, // Legendni o‘ngda chiqaramiz
      },
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemMarginBottom: 8,
      labelFormatter: function (this: any) {
        return `<span style="font-size: 14px">${this.labelOnly}: ${this.y}</span>`; // 👈 Nom + son ro‘yxatda
      },
      useHTML: true,
    },
    series: [
      {
        name: t('Baholash natijasi'),
        colorByPoint: true,
        data: [
          {
            name: `${t('Xavfi past')}: ${data?.low}`,
            labelOnly: t('Xavfi past'), // 👈 faqat nomni ajratib berdik
            y: data?.low,
            color: LOW_RISK_COLOR,
          },
          {
            name: `${t("Xavfi o'rta")}: ${data?.normal}`,
            labelOnly: t("Xavfi o'rta"),
            y: data?.normal,
            color: MEDIUM_RISK_COLOR,
          },
          {
            name: `${t('Xavfi yuqori')}: ${data?.high}`,
            labelOnly: t('Xavfi yuqori'),
            y: data?.high,
            color: HIGH_RISK_COLOR,
          },
        ],
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)',
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
