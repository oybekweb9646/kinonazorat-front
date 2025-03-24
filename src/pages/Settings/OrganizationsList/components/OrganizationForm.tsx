import { _AUTHORITY } from '@/service/const/roles';
import { useMutation } from '@/shared/hooks';
import { FormModalProps } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FieldType = {
  username: string;
  stir: number;
};

export default function OrganizationForm({
  open,
  onCancel,
  type,
  item,
}: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `user-${type}` });
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  function onFinish(values: FieldType) {
    mutate(
      {
        url: type === 'create' ? 'user/create' : `user/update/${item?.id}`,
        data: {
          username: values.username,
          stir: +values.stir,
          is_juridical: true,
          role: _AUTHORITY,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['organizations'] });
          toast.success(type === 'create' ? t("Tashkilot qo'shildi") : t('Tashkilot tahrirlandi'));
          onCancel();
        },
      },
    );
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values);
        // form.resetFields();
      })
      .catch((error) => {
        console.error('Form validation failed:', error);
      });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={isPending}
      title={type === 'create' ? t("Tashkilot qo'shish") : t('Tashkilotni tahrirlash')}
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
    >
      <Form
        form={form}
        name='indicator-form'
        layout='horizontal'
        initialValues={{
          username: item?.username,
          stir: item?.stir,
        }}
      >
        <Form.Item<FieldType>
          name='username'
          label={t('Nomi')}
          rules={[{ required: true, message: t('Nomi majburiy') }]}
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item<FieldType>
          name='stir'
          label={t('Stir')}
          rules={[{ required: true, message: t('Stir majburiy') }]}
        >
          <Input type='text' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
