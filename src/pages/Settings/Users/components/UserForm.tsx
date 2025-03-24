import { _AUTHORITY, ROLE_LIST } from '@/service/const/roles';
import { useMutation } from '@/shared/hooks';
import { FormModalProps } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FieldType = {
  username: string;
  full_name: string;
  password: string;
  role: string;
  pin_fl: number;
  status: number;
  date_of_birth: string;
};

export default function UserForm({ open, onCancel, type, item }: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `user-${type}` });
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  function onFinish(values: FieldType) {
    const customData = {
      ...values,
      date_of_birth: values.date_of_birth && dayjs(values.date_of_birth).format('YYYY-MM-DD'),
      is_juridical: false,
    };
    mutate(
      {
        url: type === 'create' ? 'user/create' : `user/update/${item?.id}`,
        data: customData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          toast.success(
            type === 'create' ? t("Foydalanuvchi qo'shildi") : t('Foydalanuvchi tahrirlandi'),
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

  const userRoles = ROLE_LIST.filter((role) => role.id !== _AUTHORITY);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={isPending}
      title={type === 'create' ? t("Foydalanuvchi qo'shish") : t('Foydalanuvchini tahrirlash')}
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
    >
      <Form
        form={form}
        name='indicator-form'
        layout='horizontal'
        initialValues={{
          username: item?.username,
          full_name: item?.full_name,
          role: item?.role,
          pin_fl: item?.pin_fl,
          status: item?.status,
          date_of_birth: item?.date_of_birth && dayjs(item?.date_of_birth),
        }}
      >
        <Form.Item<FieldType>
          name='username'
          label={t('Login')}
          rules={[{ required: true, message: t('Login majburiy') }]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item<FieldType>
          name='password'
          label={t('Parol')}
          rules={[{ required: true, message: t('Parol majburiy') }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<FieldType>
          name='full_name'
          label={t('F.I.SH')}
          // rules={[{ required: true, message: t('F.I.SH majburiy') }]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item<FieldType>
          name='pin_fl'
          label={t('PINFL')}
          // rules={[{ required: true, message: t('PINFL majburiy') }]}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item<FieldType>
          name='date_of_birth'
          label={t("Tug'ilgan sana")}
          // rules={[{ required: true, message: t("Tug'ilgan sana majburiy") }]}
        >
          <DatePicker className='w-full' format={'DD.MM.YYYY'} placeholder={t("Tug'ilgan sana")} />
        </Form.Item>
        <Form.Item<FieldType>
          name='role'
          label={t('Rol')}
          rules={[{ required: true, message: t('Role majburiy') }]}
        >
          <Select options={userRoles?.map((role) => ({ label: role.name, value: role.id }))} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
