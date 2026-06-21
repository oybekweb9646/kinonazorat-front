import { Button, Popconfirm, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch, useMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import QuestionForm from './components/QuestionForm';
import { FormStateTypes, IUseFetchResponse } from '@/shared/types';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import useQuery from '@/shared/hooks/use-query/use-query';
import ExportButtons from '@/shared/components/ExportButtons/ExportButtons';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { _PROKUROR } from '@/service/const/roles';
const { Column } = Table;

interface IRequestTypes {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
}

const QuestionsList: React.FC = () => {
  const { t } = useTranslation();
  const { query } = useQuery();
  const { data: profile } = useProfile();
  const canMutate = profile?.data?.user?.role !== _PROKUROR;

  const [formModal, setFormModal] = useState<FormStateTypes>({
    open: false,
    type: 'create',
    item: undefined,
  });

  const { mutate } = useMutation({ mutationKey: 'question-delete' });
  const queryClient = useQueryClient();

  const { data: questionsList, isFetching } = useFetch<IUseFetchResponse<IRequestTypes[]>>({
    url: '/question/filter',
    method: 'POST',
    queryKey: 'questions',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
  });

  const handleDelete = (id: number) => {
    mutate(
      {
        url: `/question/delete/${id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['questions'] });
          toast.success(t("So'rov o'chirildi"));
        },
      },
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h3 className='page-title'>{t('Normativ hujjatlar')}</h3>
        <ExportButtons
          data={questionsList?.data ?? []}
          filename="normativ-hujjatlar"
          title="Normativ hujjatlar"
          columns={[
            { title: 'ID', dataIndex: 'id' },
            { title: t('Nomi (lotin)'), dataIndex: 'title_uz' },
            { title: t('Nomi (kirill)'), dataIndex: 'title_uzc' },
            { title: t('Nomi (rus)'), dataIndex: 'title_ru' },
          ]}
        />
      </div>
      <Table
        dataSource={questionsList?.data}
        pagination={false}
        bordered
        loading={isFetching}
        footer={() => (
          <Pagination
            total={questionsList?.total}
            currentPage={questionsList?.current_page}
            align='end'
          />
        )}
      >
        <Column title={t('Nomi (lotin)')} dataIndex='title_uz' />
        <Column title={t('Nomi (kirill)')} dataIndex='title_uzc' />
        <Column title={t('Nomi (rus)')} dataIndex='title_ru' />
        {canMutate && (
          <Column
            width={'20%'}
            align='center'
            title={
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => setFormModal({ open: true, type: 'create', item: null })}
              >
                {t("Qo'shish")}
              </Button>
            }
            render={(item) => (
              <div className='flex gap-2 items-center justify-center'>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setFormModal({ open: true, type: 'update', item: item })}
                >
                  {t('Tahrirlash')}
                </Button>
                <Popconfirm
                  title={t("Savolni o'chirish")}
                  description={t("Savolni o'chirishni tasdiqlaysizmi?")}
                  onConfirm={() => handleDelete(item.id)}
                  okText={t('Ha')}
                  cancelText={t("Yo'q")}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    {t("O'chirish")}
                  </Button>
                </Popconfirm>
              </div>
            )}
          />
        )}
      </Table>

      {formModal.open && (
        <QuestionForm
          open={formModal.open}
          onCancel={() => setFormModal({ open: false })}
          item={formModal.item}
          type={formModal.type}
        />
      )}
    </div>
  );
};

export default QuestionsList;
