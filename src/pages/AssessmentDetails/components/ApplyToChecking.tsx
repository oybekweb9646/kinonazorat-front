import { useMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FieldType = {
  order_number: string;
  responsible_name: string;
  position: string;
};

export default function ApplyToChecking() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { mutate, isPending } = useMutation({ mutationKey: `apply-to-checking` });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  function onFinish(values: FieldType) {
    mutate(
      {
        url: 'user/create',
        data: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          toast.success('Muvaffaqiyatli saqlandi');
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
    <>
      <Button type='primary' onClick={showModal}>
        {t('Tekshiruvga tashabbus')}
      </Button>
      <Modal
        title={t('Tekshiruvga tashabbus')}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isPending}
        onClose={handleCancel}
      >
        <Form layout='vertical' form={form}>
          <Form.Item<FieldType>
            name='order_number'
            label={t('Buyruq raqami')}
            rules={[{ required: true, message: t('Buyruq raqami majburiy') }]}
          >
            <Input placeholder={t('Buyruq raqami')} />
          </Form.Item>
          <Form.Item<FieldType>
            name='responsible_name'
            label={t("Mas'ul xodim (F.I.O)")}
            rules={[{ required: true, message: t("Mas'ul xodim (F.I.O) majburiy") }]}
          >
            <Input placeholder={t("Mas'ul xodim (F.I.O)")} />
          </Form.Item>
          <Form.Item<FieldType>
            name='position'
            label={t('Lavozimi')}
            rules={[{ required: true, message: t('Lavozimi majburiy') }]}
          >
            <Input placeholder={t('Lavozimi')} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
