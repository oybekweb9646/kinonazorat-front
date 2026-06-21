import { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import useQuery from '@/shared/hooks/use-query/use-query';
import { useFetch } from '@/shared/hooks';
import { FormStateTypes, IUseFetchResponse } from '@/shared/types';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import AuthorityForm from './components/AuthorityForm';
import DeleteAuthorityConfirmation from './components/DeleteAuthorityConfirmation';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { _RESPONSIBLE, _SUPER_ADMIN, _TERRITORIAL_RESPONSIBLE } from '@/service/const/roles';
import ExportButtons from '@/shared/components/ExportButtons/ExportButtons';

const { Column } = Table;

const CAN_MUTATE = [_SUPER_ADMIN, _RESPONSIBLE, _TERRITORIAL_RESPONSIBLE];

interface IAuthority {
  id: number;
  stir: string;
  name_uz: string | null;
  name_ru: string | null;
  name_uzc: string | null;
  address: string | null;
  is_checked_checklist: boolean;
  is_checked_question: boolean;
}

export default function Organizations(): JSX.Element {
  const { t } = useTranslation();
  const { query } = useQuery();
  const { data: profile } = useProfile();
  const userRole = profile?.data?.user?.role;
  const canMutate = CAN_MUTATE.includes(userRole ?? 0);

  const [formModal, setFormModal] = useState<FormStateTypes>({ open: false, type: 'create' });
  const [deleteModal, setDeleteModal] = useState<FormStateTypes>({ open: false });

  const { data: authorities, isFetching } = useFetch<IUseFetchResponse<IAuthority[]>>({
    url: '/authority/filter',
    method: 'POST',
    queryKey: 'authorities',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
  });

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='page-title !mb-0'>{t('Tashkilotlar')}</h3>
        <Space>
          <ExportButtons
            data={authorities?.data ?? []}
            filename='tashkilotlar'
            title="Tashkilotlar royxati"
            columns={[
              { title: '#', dataIndex: 'id' },
              { title: t('Nomi'), dataIndex: 'name_uz' },
              { title: t('STIR'), dataIndex: 'stir' },
              { title: t('Manzil'), dataIndex: 'address' },
            ]}
          />
          {canMutate && (
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setFormModal({ open: true, type: 'create', item: null })}
            >
              {t("Qo'shish")}
            </Button>
          )}
        </Space>
      </div>

      <Table
        bordered
        dataSource={authorities?.data}
        rowKey='id'
        pagination={false}
        loading={isFetching}
        footer={() => (
          <Pagination
            total={authorities?.total}
            currentPage={authorities?.current_page}
            align='end'
          />
        )}
      >
        <Column align='center' title='#' dataIndex='id' width={60} />
        <Column title={t('Nomi')} dataIndex='name_uz' key='name_uz' />
        <Column align='center' title={t('STIR')} dataIndex='stir' key='stir' />
        <Column title={t('Manzil')} dataIndex='address' key='address' />
        {canMutate && (
          <Column
            align='center'
            title={t('Amallar')}
            width={100}
            render={(_: any, record: IAuthority) => (
              <Space>
                <Button
                  size='small'
                  icon={<EditOutlined />}
                  onClick={() => setFormModal({ open: true, type: 'update', item: record })}
                />
                <Button
                  size='small'
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setDeleteModal({ open: true, item: record })}
                />
              </Space>
            )}
          />
        )}
      </Table>

      {formModal.open && (
        <AuthorityForm
          open={formModal.open}
          onCancel={() => setFormModal({ open: false })}
          type={formModal.type}
          item={formModal.item}
        />
      )}

      {deleteModal.open && (
        <DeleteAuthorityConfirmation
          open={deleteModal.open}
          onCancel={() => setDeleteModal({ open: false })}
          item={deleteModal.item}
        />
      )}
    </div>
  );
}