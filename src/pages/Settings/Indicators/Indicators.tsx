import { Button, Popconfirm, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch, useMutation } from '@/shared/hooks';
import IndicatorForm from './components/IndicatorForm';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FormStateTypes, IUseFetchResponse, IUseFetchResponseList } from '@/shared/types';
import useQuery from '@/shared/hooks/use-query/use-query';
import Pagination from '@/shared/components/core/Pagination/Pagination';
const { Column } = Table;
import { Dropdown } from 'antd';
import Scoring from './components/Scoring';
import ExportButtons from '@/shared/components/ExportButtons/ExportButtons';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { _PROKUROR } from '@/service/const/roles';

interface IIndicator {
  created_at: string;
  deleted_at: null | string;
  id: number;
  is_active: boolean;
  name: string;
  type_id: number;
  updated_at: string;
}

interface IIndicatorType {
  created_at: string;
  id: number;
  name: string;
}

const Indicators: React.FC = () => {
  const { t } = useTranslation();
  const { query } = useQuery();
  const [formModal, setFormModal] = useState<FormStateTypes>({
    open: false,
    type: 'create',
    item: null,
  });
  const [scoringModal, setScoringModal] = useState<FormStateTypes>({
    open: false,
    type: 'create',
    item: null,
  });

  const { data: profile } = useProfile();
  const canMutate = profile?.data?.user?.role !== _PROKUROR;

  const { mutate } = useMutation({ mutationKey: 'indicator-delete' });
  const queryClient = useQueryClient();

  const { data: indicator, isFetching } = useFetch<IUseFetchResponse<IIndicator[]>>({
    url: '/indicator/filter',
    method: 'POST',
    queryKey: 'indicators',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
  });

  const { data: indicatorTypes } = useFetch<IUseFetchResponseList<IIndicatorType[]>>({
    url: '/indicator-type/list',
    method: 'GET',
    queryKey: 'indicator-types',
  });

  const handleDelete = (id: number) => {
    mutate(
      {
        url: `indicator/delete/${id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['indicators'] });
          toast.success(t("Ko'rsatkich o'chirildi"));
        },
      },
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h3 className='page-title'>{t("Ko'rsatkichlar")}</h3>
        <ExportButtons
          data={indicator?.data ?? []}
          filename="korsatkichlar"
          title="Ko'rsatkichlar"
          columns={[
            { title: 'ID', dataIndex: 'id' },
            { title: t('Nomi (lotin)'), dataIndex: 'name_uz' },
            { title: t('Nomi (kirill)'), dataIndex: 'name_uzc' },
            { title: t('Nomi (rus)'), dataIndex: 'name_ru' },
            { title: t('Max ball'), dataIndex: 'max_score' },
            { title: t('Turi'), render: (item) => indicatorTypes?.data?.find((it: IIndicatorType) => it.id === item?.type_id)?.name ?? '' },
          ]}
        />
      </div>
      <Table
        dataSource={indicator?.data || []}
        bordered
        footer={() => {
          return (
            <Pagination
              total={indicator?.total}
              currentPage={indicator?.current_page}
              align='end'
            />
          );
        }}
        pagination={false}
        loading={isFetching}
      >
        <Column title={t('Nomi (lotin)')} dataIndex='name_uz' />
        <Column title={t('Nomi (kirill)')} dataIndex='name_uzc' />
        <Column title={t('Nomi (rus)')} dataIndex='name_ru' />
        <Column title={t('Max ball')} dataIndex='max_score' align='center' />
        <Column
          title={t('Turi')}
          align='center'
          render={(item) => {
            const indicatorType = indicatorTypes?.data?.find(
              (indicatorType: IIndicatorType) => indicatorType.id === item?.type_id,
            );
            return indicatorType?.name;
          }}
        />
        {canMutate && <Column
          align='center'
          title={
            <div>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      label: t("Ko'rsatkich qo'shish"),
                      icon: <PlusOutlined />,
                      onClick: () => {
                        setFormModal({
                          open: true,
                          type: 'create',
                          item: null,
                        });
                      },
                    },
                    {
                      key: '2',
                      label: t("Ko'rsatkichga ball berish"),
                      icon: <ToolOutlined />,
                      onClick: () => {
                        setScoringModal({
                          open: true,
                          type: 'create',
                          item: null,
                        });
                      },
                    },
                  ],
                }}
                trigger={['click']}
              >
                <Button type='primary'>
                  <MoreOutlined />
                </Button>
              </Dropdown>
            </div>
          }
          render={(item) => {
            return (
              <div className='flex gap-2 items-center justify-center'>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setFormModal({
                      open: true,
                      type: 'update',
                      item: item,
                    });
                  }}
                >
                  {t('Tahrirlash')}
                </Button>
                <Popconfirm
                  title={t("Ko'rsatkichni o'chirish")}
                  description={t("Ko'rsatkichni o'chirishni tasdiqlaysizmi?")}
                  onConfirm={() => {
                    handleDelete(item.id);
                  }}
                  okText={t('Ha')}
                  cancelText={t("Yo'q")}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    {t("O'chirish")}
                  </Button>
                </Popconfirm>
              </div>
            );
          }}
        />}
      </Table>

      {formModal.open && (
        <IndicatorForm
          open={formModal.open}
          onCancel={() => setFormModal({ open: false })}
          item={formModal.item}
          type={formModal.type}
          indicatorTypes={indicatorTypes?.data || []}
        />
      )}
      {scoringModal.open && (
        <Scoring
          open={scoringModal.open}
          onCancel={() => setScoringModal({ open: false })}
          item={scoringModal.item}
          type={scoringModal.type}
          indicatorTypes={indicatorTypes?.data || []}
        />
      )}
    </div>
  );
};

export default Indicators;
