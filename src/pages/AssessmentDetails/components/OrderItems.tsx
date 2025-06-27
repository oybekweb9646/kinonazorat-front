import { downloadFile } from '@/service';
import { Button, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export default function OrderItems({ request }: { request: any }) {
  console.log('request', request);

  const { t } = useTranslation();
  const joinOrderFileName = request?.order_file_type.split('/');
  const orderFileNameFormat = joinOrderFileName?.[joinOrderFileName?.length - 1];

  return (
    <Descriptions
      items={[
        {
          key: '1',
          label: t('Buyruq raqami'),
          children: request?.order_number,
        },
        {
          key: '2',
          label: t('Buyruq sanasi'),
          children: request?.order_date && dayjs(request?.order_date).format('DD.MM.YYYY'),
        },
        {
          key: '3',
          label: t("Mas'ul xodim"),
          children: request?.order_inspector,
        },
        {
          key: '34',
          label: t('Buyruq fayli'),
          children: (
            <Button
              size='small'
              onClick={() =>
                downloadFile(
                  request.order_file_id,
                  `${request?.order_file_type || 'buyruq_fayli'}.${orderFileNameFormat}`,
                )
              }
            >
              {request?.order_file_type}
            </Button>
          ),
        },
      ]}
    />
  );
}
