import { Button, Popconfirm, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch, useMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import IndicatorTypeForm from './components/IndicatorTypeForm';
import { FormStateTypes, IUseFetchResponse } from '@/shared/types';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import useQuery from '@/shared/hooks/use-query/use-query';
const { Column } = Table;

interface IIndicatorTypes {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
}

const IndicatorTypes: React.FC = () => {
  const { t } = useTranslation();
  const { query } = useQuery();
  const [formModal, setFormModal] = useState<FormStateTypes>({
    open: false,
    type: 'create',
    item: undefined,
  });

  const { mutate } = useMutation({ mutationKey: 'indicator-type-delete' });
  const queryClient = useQueryClient();

  const { data: indicatorTypes, isFetching } = useFetch<IUseFetchResponse<IIndicatorTypes[]>>({
    url: '/indicator-type/filter',
    method: 'POST',
    queryKey: 'indicator-types',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
  });

  const handleDelete = (id: number) => {
    mutate(
      {
        url: `indicator-type/delete/${id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['indicator-types'] });
          toast.success(t("Ko'rsatkich turi o'chirildi"));
        },
      },
    );
  };

  return (
    <div>
      <h3 className='page-title'>{t("Ko'rsatkich turlari")}</h3>
      <Table
        dataSource={indicatorTypes?.data}
        pagination={false}
        bordered
        loading={isFetching}
        footer={() => (
          <Pagination
            total={indicatorTypes?.total}
            currentPage={indicatorTypes?.current_page}
            align='end'
          />
        )}
      >
        <Column title={t('Nomi (lotin)')} dataIndex='name_uz' />
        <Column title={t('Nomi (kirill)')} dataIndex='name_uzc' />
        <Column title={t('Nomi (rus)')} dataIndex='name_ru' />
        <Column
          width={'20%'}
          align='center'
          title={
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                setFormModal({
                  open: true,
                  type: 'create',
                  item: null,
                });
              }}
            >
              {t("Qo'shish")}
            </Button>
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
                  title={t("Ko'rsatkich turini o'chirish")}
                  description={t("Ko'rsatkich turinini o'chirishni tasdiqlaysizmi?")}
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
        <IndicatorTypeForm
          open={formModal.open}
          onCancel={() => setFormModal({ open: false })}
          item={formModal.item}
          type={formModal.type}
        />
      )}
    </div>
  );
};

export default IndicatorTypes;
