import { Button, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { JSX, useState } from 'react';
import UpdateAssessments from './UpdateAssessments';
import { DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { api, downloadFile, hasPermission } from '@/service';
import { _RESPONSIBLE, _SUPER_ADMIN, _TERRITORIAL_RESPONSIBLE } from '@/service/const/roles';
const { Column } = Table;

export default function IndicatorsList({ request }: { request: any }): JSX.Element {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const userRole = profile?.data?.user?.role || 0;

  const [updateAssessmentsModal, setUpdateAssessmentsModal] = useState<boolean>(false);

  const handleDownload = async () => {
    try {
      const response = await api.get(`/request/generate-pdf/${request.data.id}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Faylni yuklab olishda xatolik:', error);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <Table
        bordered
        dataSource={request?.data?.score_request_indicators || []}
        pagination={false}
        summary={() => (
          <Table.Summary.Row className='bg-gray-100'>
            <Table.Summary.Cell index={0} colSpan={3} className='font-bold'>
              {t('Umumiy ball')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align='center' index={1} colSpan={1} className='font-bold'>
              {request?.data?.score}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
        footer={() => {
          return (
            <div className='flex items-end justify-end gap-2'>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                {t('Yuklash')}
              </Button>

              {hasPermission(userRole, [_SUPER_ADMIN, _RESPONSIBLE, _TERRITORIAL_RESPONSIBLE]) && (
                <Button icon={<EditOutlined />} onClick={() => setUpdateAssessmentsModal(true)}>
                  {t('Tahrirlash')}
                </Button>
              )}
            </div>
          );
        }}
      >
        <Column align='center' dataIndex={'id'} />
        <Column
          title={t("Xavf darajasini baholash ko'rsatkichi")}
          dataIndex='indicator'
          render={(indicator) => indicator.name}
        />
        <Column
          render={(item) => {
            return (
              <div className='flex  items-center gap-2'>
                {item.file?.id && (
                  <Button
                    type='primary'
                    size='large'
                    title={t('Fayl yuklash')}
                    icon={<DownloadOutlined />}
                    onClick={() => downloadFile(item.file.id, item.file.name)}
                  ></Button>
                )}
              </div>
            );
          }}
        />
        <Column align='center' title={t('Ball')} dataIndex='score' key='score' />
      </Table>

      {updateAssessmentsModal && (
        <UpdateAssessments
          open={updateAssessmentsModal}
          onCancel={() => setUpdateAssessmentsModal(false)}
          data={request?.data?.score_request_indicators || []}
          id={request?.data?.id}
        />
      )}
    </div>
  );
}
