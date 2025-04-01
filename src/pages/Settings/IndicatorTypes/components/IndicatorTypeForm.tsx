import { useMutation } from '@/shared/hooks';
import { FormModalProps } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FieldType = {
  name_uz: string;
  name_uzc: string;
  name_ru: string;
};

export default function IndicatorTypeForm({
  open,
  onCancel,
  type,
  item,
}: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `indicator-type-${type}` });
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  function onFinish(values: FieldType) {
    mutate(
      {
        url: type === 'create' ? 'indicator-type/create' : `indicator-type/update/${item?.id}`,
        data: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['indicator-types'] });
          toast.success(
            type === 'create' ? t("Ko'rsatkich turi qo'shildi") : t("Ko'rsatkich turi tahrirlandi"),
          );
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
        form.resetFields();
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
      title={
        type === 'create' ? t("Ko'rsatkich turi qo'shish") : t("Ko'rsatkich turini tahrirlash")
      }
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
    >
      <Form
        form={form}
        name='indicator-form'
        layout='horizontal'
        initialValues={{
          name_uz: item?.name_uz,
          name_uzc: item?.name_uzc,
          name_ru: item?.name_ru,
        }}
      >
        <Form.Item<FieldType>
          name='name_uz'
          label={t('Nomi (lotin)')}
          rules={[{ required: true, message: t('Nomi (lotin) majburiy') }]}
        >
          <Input type='text' style={{ borderRadius: 5 }} />
        </Form.Item>
        <Form.Item<FieldType>
          name='name_uzc'
          label={t('Nomi (kirill)')}
          rules={[{ required: true, message: t('Nomi (kirill) majburiy') }]}
        >
          <Input type='text' style={{ borderRadius: 5 }} />
        </Form.Item>
        <Form.Item<FieldType>
          name='name_ru'
          label={t('Nomi (rus)')}
          rules={[{ required: true, message: t('Nomi (rus) majburiy') }]}
        >
          <Input type='text' style={{ borderRadius: 5 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
