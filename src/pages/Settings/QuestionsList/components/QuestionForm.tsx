import TextEditor from '@/shared/components/core/TextEditor';
import { useMutation } from '@/shared/hooks';
import { FormModalProps } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FieldType = {
  title_uz: string;
  title_uzc: string;
  title_ru: string;
  desc_uz: string;
  desc_uzc: string;
  desc_ru: string;
};

export default function QuestionForm({ open, onCancel, type, item }: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `question-${type}` });
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  function onFinish(values: FieldType) {
    mutate(
      {
        url: type === 'create' ? 'question/create' : `question/update/${item?.id}`,
        data: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['questions'] });
          toast.success(type === 'create' ? t("Savol qo'shildi") : t('Savol tahrirlandi'));
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
      title={type === 'create' ? t("Savol qo'shish") : t('Savolni tahrirlash')}
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
      width={'100%'}
      maskClosable={false}
    >
      <Form
        form={form}
        name='question-form'
        layout='vertical'
        initialValues={{
          title_uz: item?.title_uz,
          title_uzc: item?.title_uzc,
          title_ru: item?.title_ru,
          desc_uz: item?.desc_uz,
          desc_uzc: item?.desc_uzc,
          desc_ru: item?.desc_ru,
        }}
      >
        <Form.Item<FieldType>
          name='title_uz'
          label={t('Nomi (lotin)')}
          rules={[{ required: true, message: t('Nomi (lotin) majburiy') }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item<FieldType>
          name='title_uzc'
          label={t('Nomi (kirill)')}
          rules={[{ required: true, message: t('Nomi (kirill) majburiy') }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item<FieldType>
          name='title_ru'
          label={t('Nomi (rus)')}
          rules={[{ required: true, message: t('Nomi (rus) majburiy') }]}
        >
          <Input.TextArea />
        </Form.Item>
        <TextEditor
          name='desc_uz'
          label={t('Description (lotin)')}
          form={form}
          rules={[{ required: true, message: t('Description (lotin) majburiy') }]}
        />
        <TextEditor
          name='desc_uzc'
          label={t('Description (kirill)')}
          form={form}
          rules={[{ required: true, message: t('Description (kirill) majburiy') }]}
        />
        <TextEditor
          name='desc_ru'
          label={t('Description (rus)')}
          form={form}
          rules={[{ required: true, message: t('Description (rus) majburiy') }]}
        />
      </Form>
    </Modal>
  );
}
