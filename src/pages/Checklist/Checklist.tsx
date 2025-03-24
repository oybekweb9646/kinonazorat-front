import { hasPermission } from '@/service';
import { _AUTHORITY } from '@/service/const/roles';
import { useFetch, useMutation } from '@/shared/hooks';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { IUseFetchResponseList } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, List } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function Checklist() {
  const { t } = useTranslation();
  const { mutate } = useMutation({ mutationKey: 'is-checked' });
  const { mutate: confirm, isPending } = useMutation({ mutationKey: 'confirm-checklist' });
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const userRole = profile?.data?.user?.role || 0;

  const { data: checklists, isFetching } = useFetch<IUseFetchResponseList<any[]>>({
    url: '/checklist/list',
    method: 'GET',
    queryKey: 'checklists',
  });

  const handleCheck = (e: any, id: number) => {
    mutate(
      { url: `/checklist-authority/check/${id}`, data: { is_checked: e.target.checked } },
      {
        onSuccess: () => {
          toast.success(t('Muvaffaqiyatli saqlandi'));
          queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
      },
    );
  };
  const handleConfirm = () => {
    confirm(
      { url: `/checklist-authority/confirm`, method: 'GET' },
      {
        onSuccess: () => {
          toast.success(t('Muvaffaqiyatli saqlandi'));
        },
      },
    );
  };

  const isAllChecked = checklists?.data?.every(
    (item: any) => item.checked_authority?.[0]?.is_checked,
  );

  return (
    <div>
      <h3 className='page-title'>{t('Checklist')}</h3>
      <List
        bordered
        loading={isFetching}
        dataSource={checklists?.data}
        footer={
          <div className='flex justify-end'>
            {hasPermission(userRole, [_AUTHORITY]) && isAllChecked && checklists?.data?.length ? (
              <Button
                loading={isPending}
                type='primary'
                onClick={handleConfirm}
                disabled={!isAllChecked}
              >
                {t('Saqlash')}
              </Button>
            ) : (
              ''
            )}
          </div>
        }
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Checkbox
                style={{
                  transform: 'scale(1.5)',
                  display: hasPermission(userRole, [_AUTHORITY]) ? '' : 'none',
                }}
                defaultChecked={item.checked_authority?.[0]?.is_checked}
                onChange={(e: any) => handleCheck(e, item.id)}
              />,
            ]}
          >
            {item.name}
          </List.Item>
        )}
      />
    </div>
  );
}
