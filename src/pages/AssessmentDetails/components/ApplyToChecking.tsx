import { useMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input, Modal, Upload } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

type FieldType = {
  order_number: string;
  order_inspector: string;
  order_date: string;
  order_file: any;
};

export default function ApplyToChecking() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { mutate, isPending } = useMutation({ mutationKey: `apply-to-checking` });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const { mutate: uploadFile } = useMutation({ mutationKey: 'upload-file' });

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
        url: `request/create-order/${id}`,
        data: {
          ...values,
          order_file_id: values.order_file?.id,
          order_file: undefined,
          order_date: values.order_date && dayjs(values.order_date).format('YYYY-MM-DD'),
        },
      },
      {
        onSuccess: (data: any) => {
          queryClient.invalidateQueries({ queryKey: ['request'] });
          toast.success(data.message || 'Muvaffaqiyatli saqlandi');
          handleCancel();
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
        {t('Tekshiruvga asos hujjatlar')}
      </Button>
      <Modal
        title={t("Tekshiruv o'tkazish uchun asos bo'lgan hujjatlar")}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isPending}
        onClose={handleCancel}
      >
        <Form layout='vertical' form={form}>
          <Form.Item<FieldType>
            name='order_inspector'
            label={t('Tekshiruv o‘tkazuvchi mansabdor shaxs (F.I.O)')}
            rules={[
              {
                required: true,
                message: t('Tekshiruv o‘tkazuvchi mansabdor shaxs (F.I.O) majburiy'),
              },
            ]}
          >
            <Input placeholder={t('Tekshiruv o‘tkazuvchi mansabdor shaxs (F.I.O)')} />
          </Form.Item>
          <Form.Item<FieldType>
            name='order_number'
            label={t('Buyruq raqami')}
            rules={[{ required: true, message: t('Buyruq raqami majburiy') }]}
          >
            <Input placeholder={t('Buyruq raqami')} />
          </Form.Item>

          <Form.Item<FieldType>
            name='order_date'
            label={t('Buyruq sanasi')}
            rules={[{ required: true, message: t('Buyruq sanasi majburiy') }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder={t('Buyruq sanasi')}
              format={'DD.MM.YYYY'}
            />
          </Form.Item>

          <Form.Item
            name='order_file'
            label={t('Buyruq fayli')}
            rules={[
              {
                required: true,
                message: t('Buyruq fayli majburiy'),
              },
            ]}
          >
            <Upload
              name='file'
              customRequest={({ file, onSuccess }) => {
                const formData = new FormData();
                formData.append('file', file as File);

                uploadFile(
                  {
                    url: 'file/upload',
                    data: formData,
                    method: 'POST',
                  },
                  {
                    onSuccess: (data: any) => {
                      onSuccess?.(data, new XMLHttpRequest());
                      form.setFieldValue('order_file', data.data);
                    },
                    onError: () => {
                      toast.error('Fayl yuklashda xatolik yuz berdi');
                    },
                  },
                );
              }}
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button icon={<UploadOutlined />}>{t('Fayl yuklash')}</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
