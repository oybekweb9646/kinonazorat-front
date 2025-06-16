import { useTranslation } from 'react-i18next';
import { Table, Modal, Button, Popover } from 'antd';
import { JSX } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import AssessmentSwitch from '@/shared/components/AssessmentSwitch';
import UploadIndicatorFile from '@/shared/components/UploadIndicatorFile';
import { useMutation } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { downloadFile } from '@/service';
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
          queryClient.invalidateQueries({ queryKey: 'action-logs' });
          queryClient.invalidateQueries({ queryKey: 'ongoing-assessments' });
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
              <div className='flex items-center gap-2'>
                <UploadIndicatorFile item={item} />
                {item?.link_score_indicator_files?.length > 0 && (
                  <Popover
                    overlayStyle={{ width: 400 }}
                    trigger={'click'}
                    content={
                      <div className='flex justify-start flex-col gap-2'>
                        {item?.link_score_indicator_files?.map((file: any) => {
                          return (
                            <p
                              onClick={() => downloadFile(file.file?.id, file.file?.name)}
                              key={file.file?.id}
                              className='text-blue-500 cursor-pointer hover:underline break-words w-full'
                            >
                              {file?.file?.name}
                            </p>
                          );
                        })}
                      </div>
                    }
                    title={t('Fayl yuklash')}
                  >
                    <Button
                      type='primary'
                      size='large'
                      title={t('Fayl yuklash')}
                      icon={<DownloadOutlined />}
                    ></Button>
                  </Popover>
                )}
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
