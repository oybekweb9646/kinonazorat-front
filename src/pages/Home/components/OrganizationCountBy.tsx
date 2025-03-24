import { useFetch } from '@/shared/hooks';
import { Card, Statistic } from 'antd';
import { JSX, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  title: string;
  prefix?: ReactElement;
  color: string;
  api: string;
}

export default function OrganizationCountBy({ title, color, api }: Props): JSX.Element {
  const { t } = useTranslation();
  const { data } = useFetch<number>({
    url: api,
    method: 'GET',
    queryKey: ['organization-count-by', api],
  });

  return (
    <Card title={t(title)} className='h-full'>
      <div className='flex items-center justify-center gap-4 h-[300px]'>
        <div
          style={{ backgroundColor: color }}
          className='flex items-center justify-center shadow-xl h-[250px] w-[250px] rounded-full'
        >
          <Statistic
            // prefix={prefix}
            title={t('Tashkilotlar soni')}
            value={data}
            valueStyle={{ fontSize: 40 }}
          />
        </div>
      </div>
    </Card>
  );
}
