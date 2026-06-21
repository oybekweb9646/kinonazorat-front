import { useMutation } from '@/shared/hooks';
import { FormModalProps } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal } from 'antd';
import { JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FieldType = {
  stir: string;
  name_uz: string;
  name_ru: string;
  name_uzc: string;
  address: string;
};

export default function AuthorityForm({ open, onCancel, type, item }: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `authority-${type}` });
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (type === 'update' && item) {
        form.setFieldsValue({
          stir: item.stir,
          name_uz: item.name_uz,
          name_ru: item.name_ru,
          name_uzc: item.name_uzc,
          address: item.address,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, item, type, form]);

  function onFinish(values: FieldType) {
    mutate(
      {
        url: type === 'create' ? '/authority/create' : `/authority/update/${item?.id}`,
        method: 'POST',
        data: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['authorities'] });
          toast.success(type === 'create' ? t("Tashkilot qo'shildi") : t('Tashkilot tahrirlandi'));
          onCancel();
          form.resetFields();
        },
      },
    );
  }

  const handleOk = () => {
    form.validateFields().then(onFinish).catch(() => {});
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={handleOk}
      confirmLoading={isPending}
      title={type === 'create' ? t("Tashkilot qo'shish") : t('Tashkilotni tahrirlash')}
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
    >
      <Form form={form} layout='vertical'>
        <Form.Item<FieldType>
          name='stir'
          label={t('STIR')}
          rules={[{ required: true, message: t('STIR majburiy') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType> name='name_uz' label={t("Nomi (O'zbekcha)")}>
          <Input />
        </Form.Item>
        <Form.Item<FieldType> name='name_ru' label={t('Nomi (Ruscha)')}>
          <Input />
        </Form.Item>
        <Form.Item<FieldType> name='name_uzc' label={t('Nomi (Kirill)')}>
          <Input />
        </Form.Item>
        <Form.Item<FieldType> name='address' label={t('Manzil')}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}