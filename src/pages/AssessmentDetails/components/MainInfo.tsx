import { Card } from 'antd';
import { JSX } from 'react';
import { Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import { handleAssessmentColor } from '@/service';

export default function MainInfo({ data }: { data: any }): JSX.Element {
  const { t } = useTranslation();
  return (
    <Card
      title={t("Asosiy ma'lumotlar")}
      style={{ backgroundColor: handleAssessmentColor(data?.score) }}
    >
      <Descriptions
        title={data?.authority?.name}
        items={[
          {
            key: '1',
            label: t('STIR'),
            children: data?.authority?.stir,
          },
          {
            key: '3',
            label: t('Manzil'),
            children:
              data?.authority?.address ||
              data?.authority?.billing_address ||
              data?.authority?.director_address,
          },
        ]}
      />
    </Card>
  );
}
