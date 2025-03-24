import { Avatar, Button, Dropdown, Layout, Select, Spin, theme } from 'antd';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { changeLanguage } from '@/shared/i18n';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@/shared/hooks';
import { removeRefreshToken, removeToken } from '@/service/storage';
import { useState } from 'react';
import Profile from '@/shared/components/Profile';

const { Header } = Layout;

export default function Navbar({ collapsed, setCollapsed }: any) {
  const [isOpenProfileModal, setIsOpenProfileModal] = useState<boolean>(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { mutate, isPending } = useMutation({ mutationKey: 'logout' });

  const handleLogout = () => {
    mutate(
      {
        url: '/auth/logout',
        method: 'GET',
      },
      {
        onSuccess: () => {
          removeToken();
          removeRefreshToken();
          window.location.href = '/login';
        },
      },
    );
  };

  const { i18n, t } = useTranslation();

  return (
    <Header style={{ background: colorBgContainer, padding: '10px 40px' }}>
      <Spin spinning={isPending} size='large' fullscreen />
      <div className='flex items-center justify-between relative'>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          size='large'
        />
        <h1 className='text-2xl absolute left-1/2 transform -translate-x-1/2 font-bold text-[#014158]  font-sans'>
          {t('Xavfni tahlil qilish tizimi')}
        </h1>
        <div className='flex items-center gap-4'>
          <Select
            // shape='round'
            style={{ width: 120 }}
            defaultValue={i18n.language || 'uz'}
            onChange={(value: string) => changeLanguage(value)}
            options={[
              {
                label: "O'zbekcha",
                value: 'uz',
              },
              {
                label: 'Ўзбекча',
                value: 'uzc',
              },
              {
                label: 'Русский',
                value: 'ru',
              },
            ]}
          />
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: '1',
                  label: t('Profil'),
                  icon: <UserOutlined />,

                  onClick: () => {
                    setIsOpenProfileModal(true);
                  },
                },
                {
                  key: '2',
                  label: t('Chiqish'),
                  icon: <LogoutOutlined />,
                  danger: true,
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <Avatar
              shape='circle'
              className='cursor-pointer'
              size={'large'}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </div>
      </div>

      {isOpenProfileModal && (
        <Profile open={isOpenProfileModal} onCancel={() => setIsOpenProfileModal(false)} />
      )}
    </Header>
  );
}
