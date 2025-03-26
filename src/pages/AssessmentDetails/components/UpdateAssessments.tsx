import { useTranslation } from 'react-i18next';
import { Button, Table, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { JSX } from 'react';
import AssessmentSwitch from '@/shared/components/AssessmentSwitch';
import { downloadFile } from '@/service';
import UploadIndicatorFile from '@/shared/components/UploadIndicatorFile';
import { useMutation } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
const { Column } = Table;

export default function UpdateAssessments({
  open,
  onCancel,
  data,
  id,
}: {
  open: boolean;
  onCancel: () => void;
  data: any;
  id: number;
}): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: 'confirm-finishing' });
  const queryClient = useQueryClient();

  function onOk() {
    mutate(
      {
        url: `/request/scored/${id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          onCancel();
          toast.success(t('Muvaffaqiyatli saqlandi'));
          queryClient.invalidateQueries({ queryKey: ['request'] });
        },
      },
    );
  }

  return (
    <Modal
      title={t('Baholashni tahrirlash')}
      open={open}
      width={1000}
      onOk={onOk}
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
      onCancel={onCancel}
      confirmLoading={isPending}
    >
      <Table bordered dataSource={data || []} pagination={false}>
        <Column align='center' dataIndex={'id'} />
        <Column
          title={t("Xavf darajasini baholash ko'rsatkichi")}
          dataIndex='indicator'
          render={(indicator) => indicator.name}
        />

        <Column
          render={(item) => {
            return (
              <div className='flex flex-col items-center gap-2'>
                {item.file?.id && (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => downloadFile(item.file.id, item.file.name)}
                  >
                    {t('Fayl yuklash')}
                  </Button>
                )}
                <UploadIndicatorFile item={item} />
              </div>
            );
          }}
        />
        <Column align='center' title={t('Ball')} dataIndex='score' key='score' />
        <Column
          render={(item) => {
            return <AssessmentSwitch item={item} />;
          }}
        />
      </Table>
    </Modal>
  );
}
