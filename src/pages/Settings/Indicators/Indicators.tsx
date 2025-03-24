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
      <h3 className='page-title'>{t("Ko'rsatkichlar")}</h3>
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
        <Column title={t('Nomi (lotin)')} dataIndex='name_uz' width={'20%'} />
        <Column title={t('Nomi (kirill)')} dataIndex='name_uzc' width={'20%'} />
        <Column title={t('Nomi (rus)')} dataIndex='name_ru' width={'20%'} />
        <Column title={t('Max ball')} dataIndex='max_score' width={'20%'} />
        <Column
          width={'20%'}
          title={t('Turi')}
          render={(item) => {
            const indicatorType = indicatorTypes?.data?.find(
              (indicatorType: IIndicatorType) => indicatorType.id === item?.type_id,
            );
            return indicatorType?.name;
          }}
        />
        <Column
          width={'20%'}
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
        />
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
