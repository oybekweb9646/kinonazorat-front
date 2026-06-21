import { useMutation } from '@/shared/hooks';
import { FormModalProps } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function DeleteAuthorityConfirmation({
  open,
  onCancel,
  item,
}: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: 'authority-delete' });
  const queryClient = useQueryClient();

  const handleDelete = () => {
    mutate(
      {
        url: `/authority/delete/${item?.id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['authorities'] });
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
      okText={t("O'chirish")}
      okButtonProps={{ danger: true }}
      cancelText={t('Bekor qilish')}
    >
      <p>
        {t("Haqiqatan ham")} <strong>{item?.name_uz || item?.stir}</strong>{' '}
        {t("tashkilotini o'chirmoqchimisiz?")}
      </p>
    </Modal>
  );
}