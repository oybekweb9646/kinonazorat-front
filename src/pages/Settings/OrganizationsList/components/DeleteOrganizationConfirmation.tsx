import { useMutation } from '@/shared/hooks';
import { FormModalProps } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function DeleteOrganizationConfirmation({
  open,
  onCancel,
  item,
}: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `organization-delete` });
  const queryClient = useQueryClient();

  const handleDelete = () => {
    mutate(
      {
        url: `/user/delete/${item.id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['organizations'] });
          toast.success(t("Tashkilot o'chirildi"));
          onCancel();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleDelete}
      confirmLoading={isPending}
      title={t("Tashkilotni o'chirish")}
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
    ></Modal>
  );
}
