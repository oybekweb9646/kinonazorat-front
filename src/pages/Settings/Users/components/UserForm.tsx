import { _AUTHORITY, _TERRITORIAL_RESPONSIBLE, ROLE_LIST } from '@/service/const/roles';
import { useFetch, useMutation } from '@/shared/hooks';
import { FormModalProps, IUseFetchResponseList } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { JSX, useEffect, useState } from 'react';
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
  organization_id: number;
};

export default function UserForm({ open, onCancel, type, item }: FormModalProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({ mutationKey: `user-${type}` });
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState('');

  const [form] = Form.useForm();

  const { data: organizations } = useFetch<IUseFetchResponseList<any>>({
    url: '/organization/list',
    method: 'GET',
    queryKey: 'aoka-organizations-list',
  });

  function onFinish(values: FieldType) {
    const customData = {
      ...values,
      date_of_birth: values.date_of_birth && dayjs(values.date_of_birth).format('YYYY-MM-DD'),
      is_juridical: false,
      organization_id:
        Number(values.role) === _TERRITORIAL_RESPONSIBLE ? values.organization_id : null,
      full_name: values.full_name ?? undefined,
      pin_fl: values.pin_fl ? Number(values.pin_fl) : undefined,
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

  function handleValuesChange(_: any, allValues: FieldType) {
    const role = allValues.role;
    setSelectedRole(role);
  }

  useEffect(() => {
    if (item?.role) {
      setSelectedRole(item.role);
    }
  }, [item]);

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
          region_id: item?.region_id,
        }}
        onValuesChange={handleValuesChange}
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

        {Number(selectedRole) === _TERRITORIAL_RESPONSIBLE && (
          <Form.Item<FieldType>
            name='organization_id'
            label={t('Tashkilot')}
            rules={[{ required: true, message: t('Tashkilot majburiy') }]}
          >
            <Select
              options={organizations?.data?.map((organization: any) => ({
                label: organization.name,
                value: organization.id,
              }))}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
