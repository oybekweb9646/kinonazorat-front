import { Button, Dropdown, Table, Tag } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  MoreOutlined,
  PlusOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch, useMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import OrganizationForm from './components/OrganizationForm';
import { FormStateTypes, IUseFetchResponse } from '@/shared/types';
import useQuery from '@/shared/hooks/use-query/use-query';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import { _BANNED, USER_STATUS_LIST } from '@/service/const/user-statuses';
import DeleteOrganizationConfirmation from './components/DeleteOrganizationConfirmation';

const { Column } = Table;

interface IOrganization {
  auth_type: string;
  authority_id: null | number;
  created_at: string;
  date_of_birth: null | string;
  egov_token: null | string;
  full_name: null | string;
  id: number;
  is_juridical: boolean;
  phone: null | string;
  pin_fl: string;
  position_name: null | string;
  role: string;
  status: number;
  stir: null | string;
  updated_at: string;
  username: string;
}

const OrganizationsList: React.FC = () => {
  const { t } = useTranslation();
  const { query } = useQuery();
  const [formModal, setFormModal] = useState<FormStateTypes>({
    open: false,
    type: 'create',
    item: null,
  });

  const [deleteModal, setDeleteModal] = useState<FormStateTypes>({
    open: false,

    item: null,
  });

  const { mutate: block } = useMutation({ mutationKey: 'block-organization' });
  const queryClient = useQueryClient();

  const { data: organizations, isFetching } = useFetch<IUseFetchResponse<IOrganization[]>>({
    url: '/user/filter',
    method: 'POST',
    queryKey: 'organizations',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
    body: {
      is_juridical: true,
    },
  });

  function blockUser(id: number) {
    block(
      {
        url: `/user/ban/${id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['organizations'] });
          toast.success(t('Tashkilot bloklandi'));
        },
      },
    );
  }

  function unBlockUser(id: number) {
    block(
      {
        url: `/user/unban/${id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['organizations'] });
          toast.success(t('Tashkilot bloklandi'));
        },
      },
    );
  }

  return (
    <div>
      <h3 className='page-title'>{t('Tashkilotlar')}</h3>
      <Table
        dataSource={organizations?.data}
        pagination={false}
        loading={isFetching}
        bordered
        footer={() => {
          return (
            <Pagination
              total={organizations?.total}
              currentPage={organizations?.current_page}
              align='end'
            />
          );
        }}
      >
        <Column align='center' title={t('ID')} dataIndex='id' />
        <Column align='center' title={t('Username')} dataIndex='username' />
        <Column align='center' title={t('Stir')} dataIndex={'stir'} />
        <Column
          align='center'
          title={t('Status')}
          render={(item) => {
            const status = USER_STATUS_LIST.find((s) => s.id === item?.status);
            return (
              <Tag color={USER_STATUS_LIST.find((s) => s.id === item?.status)?.color}>
                {status?.name}
              </Tag>
            );
          }}
        />
        <Column
          align='center'
          title={
            <Button
              title={t("Qo'shish")}
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
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    {
                      key: '1',
                      label: t('Tahrirlash'),
                      onClick: () => {
                        setFormModal({
                          open: true,
                          type: 'update',
                          item: item,
                        });
                      },
                      icon: <EditOutlined />,
                    },

                    {
                      key: '2',
                      label: t('Bloklash'),
                      onClick: () => {
                        blockUser(item.id);
                      },
                      style: {
                        display: item.status !== _BANNED ? 'block' : 'none',
                      },
                      icon: <LockOutlined />,
                    },
                    {
                      key: '3',
                      label: t('Blokdan chiqarish'),
                      onClick: () => {
                        unBlockUser(item.id);
                      },
                      style: {
                        display: item.status === _BANNED ? 'block' : 'none',
                      },
                      icon: <UnlockOutlined />,
                    },
                    {
                      key: '4',
                      label: t("O'chirish"),
                      onClick: () => {
                        setDeleteModal({
                          open: true,
                          item: item,
                        });
                      },
                      icon: <DeleteOutlined />,
                      danger: true,
                    },
                  ],
                }}
              >
                <Button>
                  <MoreOutlined />
                </Button>
              </Dropdown>
            );
          }}
        />
      </Table>

      {formModal.open && (
        <OrganizationForm
          open={formModal.open}
          onCancel={() => setFormModal({ open: false })}
          item={formModal.item}
          type={formModal.type}
        />
      )}

      {deleteModal.open && (
        <DeleteOrganizationConfirmation
          open={deleteModal.open}
          onCancel={() => setDeleteModal({ open: false })}
          item={deleteModal.item}
        />
      )}
    </div>
  );
};

export default OrganizationsList;
