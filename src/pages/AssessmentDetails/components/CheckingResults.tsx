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
  act_number: string;
  act_date: string;
  act_file: any;
};

export default function CheckingResults() {
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
        url: `/request/request-archive/${id}`,
        data: {
          ...values,
          act_file_id: values.act_file?.id,
          act_file: undefined,
          act_date: values.act_date && dayjs(values.act_date).format('YYYY-MM-DD'),
        },
      },
      {
        onSuccess: ({ data }: any) => {
          queryClient.invalidateQueries({ queryKey: ['request'] });
          toast.success(data.message);
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
        {t('Tekshiruvga natijalari')}
      </Button>
      <Modal
        title={t('Tekshiruvga natijalari')}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isPending}
        onClose={handleCancel}
      >
        <Form layout='vertical' form={form}>
          <Form.Item<FieldType>
            name='act_number'
            label={t('Akt raqami')}
            rules={[{ required: true, message: t('Akt raqami majburiy') }]}
          >
            <Input placeholder={t('Akt raqami')} />
          </Form.Item>

          <Form.Item<FieldType>
            name='act_date'
            label={t('Akt sanasi')}
            rules={[{ required: true, message: t('Akt sanasi majburiy') }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder={t('Akt sanasi')}
              format={'DD.MM.YYYY'}
            />
          </Form.Item>

          <Form.Item<FieldType> name='act_file' label={t('Akt fayli')} required>
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
