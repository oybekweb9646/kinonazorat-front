import { downloadFile } from '@/service';
import { Button, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export default function ActItems({ request }: { request: any }) {
  const { t } = useTranslation();
  const joinActFileName = request?.act_file_type?.split('/');
  const actFileNameFormat = joinActFileName?.[joinActFileName?.length - 1];

  return (
    <Descriptions
      items={[
        {
          key: '1',
          label: t('Akt raqami'),
          children: request?.act_number,
        },
        {
          key: '2',
          label: t('Akt sanasi'),
          children: request?.act_date && dayjs(request?.order_date).format('DD.MM.YYYY'),
        },
        {
          key: '4',
          label: t('Akt fayli'),
          children: (
            <Button
              size='small'
              onClick={() =>
                downloadFile(
                  request.act_file_id,
                  `${request?.act_file_type || 'akt_fayli'}.${actFileNameFormat}`,
                )
              }
            >
              {request?.act_file_type}
            </Button>
          ),
        },
      ]}
    />
  );
}
