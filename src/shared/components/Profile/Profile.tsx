import { ROLE_LIST } from '@/service/const/roles';
import { USER_STATUS_LIST } from '@/service/const/user-statuses';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
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
            key: '5',
            label: t('Status'),
            children: USER_STATUS_LIST.find((status) => status.id === profile?.status)?.name,
          },
        ]}
      />
    </Modal>
  );
}
