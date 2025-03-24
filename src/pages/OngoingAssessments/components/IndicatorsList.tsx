import { useFetch } from '@/shared/hooks';
import { FormModalProps, IUseFetchResponseList } from '@/shared/types';
import { Button, Modal, Table } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
const { Column } = Table;
export default function IndicatorsList({ open, type, item, onCancel }: FormModalProps) {
  const { t } = useTranslation();
  const { data: indicator, isFetching } = useFetch<IUseFetchResponseList<any[]>>({
    url: '/indicator/list',
    method: 'GET',
    queryKey: 'indicators',
  });
  console.log('type', type);

  return (
    <Modal
      title={`${item.organization}  (${item.name})`}
      open={open}
      onOk={() => console.log('ok')}
      onCancel={onCancel}
      width={'100%'}
      maskClosable={false}
      okText={t('Yakunlash')}
      cancelText={t('Bekor qilish')}
    >
      <Table bordered loading={isFetching} dataSource={indicator?.data || []} pagination={false}>
        <Column
          align='center'
          render={(_, __, index) => {
            return index + 1;
          }}
        />
        <Column title={t("Xavf darajasini baholash ko'rsatkichi")} dataIndex='name' key='name' />

        <Column
          // title={t('Fayl yuklash')}
          render={() => {
            return <Button icon={<DownloadOutlined />}>{t('Fayl yuklash')}</Button>;
          }}
        />
        <Column align='center' title={t('Ball')} dataIndex='score' key='score' />
        {/* <Column
          render={(item) => {
            return <RatingSwitch item={item} />;
          }}
        /> */}
      </Table>
    </Modal>
  );
}
