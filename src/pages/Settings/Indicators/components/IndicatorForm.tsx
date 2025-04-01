import { useMutation } from '@/shared/hooks';
import { FormModalProps, IIndicatorType, TSelectOption } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal, Select } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FieldType = {
  name_uz: string;
  name_uzc: string;
  name_ru: string;
  type_id: number;
};

interface ExtendedProps extends FormModalProps {
  indicatorTypes: IIndicatorType[];
}

export default function IndicatorForm({
  open,
  onCancel,
  type,
  item,
  indicatorTypes,
}: ExtendedProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `indicator-${type}` });
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  function onFinish(values: FieldType) {
    mutate(
      {
        url: type === 'create' ? 'indicator/create' : `indicator/update/${item?.id}`,
        data: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['indicators'] });
          toast.success(
            type === 'create' ? t("Ko'rsatkich qo'shildi") : t("Ko'rsatkich tahrirlandi"),
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
      title={type === 'create' ? t("Ko'rsatkich qo'shish") : t("Ko'rsatkichni tahrirlash")}
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
      width={800}
    >
      <Form
        form={form}
        name='indicator-form'
        layout='horizontal'
        initialValues={{
          name_uz: item?.name_uz,
          name_uzc: item?.name_uzc,
          name_ru: item?.name_ru,
          type_id: item?.type_id,
        }}
      >
        <Form.Item<FieldType>
          name='name_uz'
          label={t('Nomi (lotin)')}
          rules={[{ required: true, message: t('Nomi (lotin) majburiy') }]}
        >
          <Input.TextArea rows={4} style={{ borderRadius: 12 }} />
        </Form.Item>
        <Form.Item<FieldType>
          name='name_uzc'
          label={t('Nomi (kirill)')}
          rules={[{ required: true, message: t('Nomi (kirill) majburiy') }]}
        >
          <Input.TextArea rows={4} style={{ borderRadius: 12 }} />
        </Form.Item>
        <Form.Item<FieldType>
          name='name_ru'
          label={t('Nomi (rus)')}
          rules={[{ required: true, message: t('Nomi (rus) majburiy') }]}
        >
          <Input.TextArea rows={4} style={{ borderRadius: 12 }} />
        </Form.Item>

        <Form.Item<FieldType>
          name='type_id'
          label={t("Ko'rsatkich turi")}
          rules={[{ required: true, message: t("Ko'rsatkich turi majburiy") }]}
        >
          <Select
            options={indicatorTypes?.map(({ id, name }: TSelectOption) => ({
              label: name,
              value: id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
