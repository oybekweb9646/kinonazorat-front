import { ROLE_LIST } from '@/service/const/roles';
import { USER_STATUS_LIST } from '@/service/const/user-statuses';
import { useFetch } from '@/shared/hooks';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { IUseFetchResponseList } from '@/shared/types';
import { Descriptions, Modal } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onCancel: () => void;
}

export default function Profile({ open, onCancel }: Props): JSX.Element {
  const { t } = useTranslation();
  const { data, isFetching } = useProfile();
  const profile = data?.data?.user;

  const { data: organizations } = useFetch<IUseFetchResponseList<any>>({
    url: '/organization/list',
    method: 'GET',
    queryKey: 'aoka-organizations-list',
  });

  return (
    <Modal
      loading={isFetching}
      title={t('Profil')}
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions
        title={profile?.full_name}
        column={1}
        items={[
          {
            key: '1',
            label: t('Username'),
            children: profile?.username,
          },

          {
            key: '3',
            label: t('PINFL'),
            children: profile?.pin_fl,
          },
          {
            key: '4',
            label: t('Rol'),
            children: ROLE_LIST.find((role) => role.id === profile?.role)?.name,
          },
          {
            key: '4',
            label: t('Tashkilot'),
            children: organizations?.data?.find((r: any) => r.id === profile?.organization_id)
              ?.name,
            style: { display: profile?.organization_id ? 'block' : 'none' },
          },
          {
            key: '5',
            label: t('Status'),
            children: USER_STATUS_LIST.find((status) => status.id === profile?.status)?.name,
          },
          {
            key: '5',
            label: t('Tashkilot nomi'),
            children: profile?.authority?.name,
            style: { display: profile?.authority?.name ? 'block' : 'none' },
          },
          {
            key: '5',
            label: t('Manzil'),
            children: profile?.authority?.address || profile?.authority?.billing_address,
            style: {
              display:
                profile?.authority?.address || profile?.authority?.billing_address
                  ? 'block'
                  : 'none',
            },
          },
        ]}
      />
    </Modal>
  );
}
