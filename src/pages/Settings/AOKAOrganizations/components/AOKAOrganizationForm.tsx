import { useFetch, useMutation } from '@/shared/hooks';
import { FormModalProps, IUseFetchResponseList } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal, Select } from 'antd';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FieldType = {
  name_uz: string;
  name_uzc: string;
  name_ru: string;
  inn: string;
  region_id: number;
};

export default function AOKAOrganizationForm({
  open,
  onCancel,
  type,
  item,
}: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `aoka-organization-${type}` });
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  function onFinish(values: FieldType) {
    mutate(
      {
        url: type === 'create' ? '/organization/create' : `/organization/update/${item?.id}`,
        data: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['aoka-organizations'] });
          toast.success(
            type === 'create' ? t("AOKA tashkiloti qo'shildi") : t('AOKA tashkiloti tahrirlandi'),
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

  const { data: regions } = useFetch<IUseFetchResponseList<any>>({
    url: '/soato-region/list',
    method: 'GET',
    queryKey: 'regions',
  });

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={isPending}
      title={
        type === 'create' ? t("AOKA tashkilotini qo'shish") : t('AOKA tashkilotini tahrirlash')
      }
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
    >
      <Form
        form={form}
        name='aoka-organization-form'
        layout='horizontal'
        initialValues={{
          name_uz: item?.name_uz,
          name_uzc: item?.name_uzc,
          name_ru: item?.name_ru,
          inn: item?.inn,
          region_id: item?.region_id,
        }}
      >
        <Form.Item<FieldType>
          name='name_uz'
          label={t('Nomi (lotin)')}
          rules={[{ required: true, message: t('Nomi (lotin) majburiy') }]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item<FieldType>
          name='name_uzc'
          label={t('Nomi (kirill)')}
          rules={[{ required: true, message: t('Nomi (kirill) majburiy') }]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item<FieldType>
          name='name_ru'
          label={t('Nomi (rus)')}
          rules={[{ required: true, message: t('Nomi (rus) majburiy') }]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item<FieldType>
          name='inn'
          label={t('INN')}
          rules={[{ required: true, message: t('INN majburiy') }]}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item<FieldType>
          name='region_id'
          label={t('Hudud')}
          rules={[{ required: true, message: t('Hudud majburiy') }]}
        >
          <Select
            options={regions?.data?.map((region: any) => ({
              label: region.name,
              value: region.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
