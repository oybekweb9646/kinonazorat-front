import React, { useState } from 'react';
import { Button, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import ConfirmFinishing from './ConfirmFinishing';
import { IUseFetchResponseList } from '@/shared/types';
import { useFetch } from '@/shared/hooks';
import useQuery from '@/shared/hooks/use-query/use-query';
import AssessmentSwitch from '@/shared/components/AssessmentSwitch';
import UploadIndicatorFile from '@/shared/components/UploadIndicatorFile';
import { downloadFile } from '@/service';

const { Column } = Table;

const IndicatorsList: React.FC = () => {
  const { t } = useTranslation();
  const { query } = useQuery();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    data: indicatorsList,
    isFetching,
    refetch,
  } = useFetch<IUseFetchResponseList<any>>({
    url: `/request/get/${query.request_id}`,
    method: 'GET',
    queryKey: ['request-indicators', String(query.request_id)],
    queryOptions: {
      enabled: !!query.request_id,
    },
  });

  return (
    <div>
      <Table
        bordered
        loading={isFetching}
        dataSource={indicatorsList?.data?.score_request_indicators}
        pagination={false}
        footer={() => {
          return (
            <div className='flex items-center justify-end'>
              <Button icon={<SaveOutlined />} type='primary' onClick={() => setIsModalOpen(true)}>
                {t('Yakunlash')}
              </Button>
            </div>
          );
        }}
      >
        <Column
          align='center'
          render={(_, __, index) => {
            return index + 1;
          }}
        />
        <Column
          title={t("Xavf darajasini baholash ko'rsatkichi")}
          render={(item) => {
            return item.indicator?.name;
          }}
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
        <Column
          align='center'
          title={t('Ball')}
          render={(item) => {
            return item?.max_score;
          }}
        />
        <Column
          render={(item) => {
            return item.id && <AssessmentSwitch item={item} refetch={refetch} />;
          }}
        />
      </Table>

      {isModalOpen && (
        <ConfirmFinishing
          isModalOpen={isModalOpen}
          handleCancel={() => setIsModalOpen(false)}
          data={indicatorsList?.data}
        />
      )}
    </div>
  );
};

export default IndicatorsList;
