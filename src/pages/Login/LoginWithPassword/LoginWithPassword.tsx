import React from 'react';
import { setToken } from '@/service/storage';
import { useMutation } from '@/shared/hooks';
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { DefaultError } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GerbIcon from '@/shared/assets/icons/gerb.svg';
import { _AUTHORITY } from '@/service/const/roles';
import { api } from '@/service';

type FieldType = {
  username: string;
  password: string;
};

type BodyType = {
  access_token: string;
  token_type: string;
};

type DataType = {
  code: number;
  message: string;
  success: boolean;
  data: BodyType;
};

const LoginWithPassword: React.FC = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation<DataType, DefaultError>({
    mutationKey: 'login',
    onError: () => {},
  });
  const navigate = useNavigate();

  async function getProfile() {
    try {
      const { data } = await api.get('/user/detail');

      if (data.data.user.role === _AUTHORITY) {
        navigate('/normative-documents');
      } else {
        navigate('/');
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  function onSubmit(values: FieldType) {
    mutate(
      { url: 'auth/login-by-user', data: values },
      {
        onSuccess: (data: DataType) => {
          setToken(data.data.access_token);
          getProfile();
        },
      },
    );
  }
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-md p-6 max-w-md w-full'>
        <div className='flex flex-col items-center mt-4'>
          <img src={GerbIcon} alt='' className='w-30 h-30' />
          <div className='p-4 text-center'>
            <span className='font-bold font-sans'>
              Farmasevtika maxsulotlari xavfsizligi markazi
            </span>{' '}
            davlat muassasasi
          </div>
        </div>
        <h1 className='page-title text-center'>Xavfni tahlil qilish</h1>
        <Form layout='vertical' name='login-with-password' onFinish={(values) => onSubmit(values)}>
          <Form.Item<FieldType>
            name='username'
            label={t('Username')}
            rules={[{ required: true, message: t('Username is required') }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('Enter username')}
              className='w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-0'
              size='large'
            />
          </Form.Item>

          <Form.Item<FieldType>
            name='password'
            label={t('Password')}
            rules={[{ required: true, message: t('Password is required') }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('Enter password')}
              className='w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-0'
              size='large'
            />
          </Form.Item>

          <Form.Item label={null}>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              loading={isPending}
              icon={<LoginOutlined />}
              className='bg-blue-500 text-white hover:bg-blue-600 border-blue-500 rounded-md w-full'
            >
              {t('Login')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginWithPassword;
