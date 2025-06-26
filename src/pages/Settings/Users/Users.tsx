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
import dayjs from 'dayjs';
import UserForm from './components/UserForm';
import { FormStateTypes, IUseFetchResponse } from '@/shared/types';
import useQuery from '@/shared/hooks/use-query/use-query';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import { _BANNED, USER_STATUS_LIST } from '@/service/const/user-statuses';
import DeleteUserConfirmation from './components/DeleteUserConfirmation';
import { ROLE_LIST } from '@/service/const/roles';
const { Column } = Table;

interface IUser {
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

const Users: React.FC = () => {
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

  const { mutate: block } = useMutation({ mutationKey: 'block-user' });
  const queryClient = useQueryClient();

  const { data: users, isFetching } = useFetch<IUseFetchResponse<IUser[]>>({
    url: '/user/filter',
    method: 'POST',
    queryKey: 'users',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
    body: {
      is_juridical: false,
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
          queryClient.invalidateQueries({ queryKey: ['users'] });
          toast.success(t('Foydalanuvchi bloklandi'));
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
          queryClient.invalidateQueries({ queryKey: ['users'] });
          toast.success(t('Foydalanuvchi bloklandi'));
        },
      },
    );
  }

  // const { data: regions } = useFetch<IUseFetchResponseList<any>>({
  //   url: '/soato-region/list',
  //   method: 'GET',
  //   queryKey: 'regions',
  // });

  return (
    <div className='w-full overflow-auto'>
      <h3 className='page-title'>{t('Foydalanuvchilar')}</h3>
      <Table
        dataSource={users?.data}
        pagination={false}
        loading={isFetching}
        bordered
        footer={() => {
          return <Pagination total={users?.total} currentPage={users?.current_page} align='end' />;
        }}
      >
        <Column align='center' title={t('ID')} dataIndex={'id'} />
        <Column
          align='center'
          title={t('Foydalanuvchi nomi')}
          dataIndex='username'
          className='word-break'
        />
        <Column align='center' title={t('F.I.SH')} dataIndex='full_name' />
        <Column align='center' title={t('PINFL')} dataIndex='pin_fl' />
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
          title={t('Rol')}
          render={(item) => {
            const role = ROLE_LIST.find((r) => r.id === item?.role)?.name;
            // const regionName = regions?.data.find((r: any) => r.id === item?.region_id)?.name;
            return (
              <div className='flex flex-col items-center'>
                <p>{role}</p>
                {item.organization_name && (
                  <p className='text-wrap text-sm text-gray-500 italic'>{item.organization_name}</p>
                )}
              </div>
            );
          }}
        />
        <Column
          align='center'
          title={t("Tug'ilgan sana")}
          render={(item) => {
            return item?.date_of_birth && dayjs(item?.date_of_birth).format('DD.MM.YYYY');
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
        <UserForm
          open={formModal.open}
          onCancel={() => setFormModal({ open: false })}
          item={formModal.item}
          type={formModal.type}
        />
      )}
      {deleteModal.open && (
        <DeleteUserConfirmation
          open={deleteModal.open}
          onCancel={() => setDeleteModal({ open: false })}
          item={deleteModal.item}
        />
      )}
    </div>
  );
};

export default Users;
