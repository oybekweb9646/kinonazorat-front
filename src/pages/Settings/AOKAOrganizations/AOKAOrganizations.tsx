import { Button, Popconfirm, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch, useMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FormStateTypes, IUseFetchResponse, IUseFetchResponseList } from '@/shared/types';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import useQuery from '@/shared/hooks/use-query/use-query';
import AOKAOrganizationForm from './components/AOKAOrganizationForm';
const { Column } = Table;

interface IAOKAOrganization {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
}

const AOKAOrganizations: React.FC = () => {
  const { t } = useTranslation();
  const { query } = useQuery();
  const [formModal, setFormModal] = useState<FormStateTypes>({
    open: false,
    type: 'create',
    item: undefined,
  });

  const { mutate } = useMutation({ mutationKey: 'indicator-type-delete' });
  const queryClient = useQueryClient();

  const { data: aokaOrganizations, isFetching } = useFetch<IUseFetchResponse<IAOKAOrganization[]>>({
    url: '/organization/filter',
    method: 'POST',
    queryKey: 'aoka-organizations',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
  });

  const { data: regions } = useFetch<IUseFetchResponseList<any>>({
    url: '/soato-region/list',
    method: 'GET',
    queryKey: 'regions',
  });

  const handleDelete = (id: number) => {
    mutate(
      {
        url: `/organization/delete/${id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['aoka-organizations'] });
          toast.success(t("Tashkilot o'chirildi"));
        },
      },
    );
  };

  return (
    <div>
      <h3 className='page-title'>{t('AOKA tashkilotlari')}</h3>
      <Table
        dataSource={aokaOrganizations?.data}
        pagination={false}
        bordered
        loading={isFetching}
        footer={() => (
          <Pagination
            total={aokaOrganizations?.total}
            currentPage={aokaOrganizations?.current_page}
            align='end'
          />
        )}
      >
        <Column title={t('Nomi (lotin)')} dataIndex='name_uz' />
        <Column title={t('Nomi (kirill)')} dataIndex='name_uzc' />
        <Column title={t('Nomi (rus)')} dataIndex='name_ru' />
        <Column title={t('INN')} dataIndex='inn' />
        <Column
          title={t('Hudud')}
          dataIndex='region_id'
          render={(region_id) => {
            return regions?.data.find((region: any) => region.id === region_id)?.name;
          }}
        />
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
        <AOKAOrganizationForm
          open={formModal.open}
          onCancel={() => setFormModal({ open: false })}
          item={formModal.item}
          type={formModal.type}
        />
      )}
    </div>
  );
};

export default AOKAOrganizations;
