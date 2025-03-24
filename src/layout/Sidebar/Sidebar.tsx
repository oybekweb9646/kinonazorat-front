import { getSidebarCollapsed, setSidebarCollapsed } from '@/service/storage';
import {
  BankOutlined,
  CheckOutlined,
  FileOutlined,
  GroupOutlined,
  HomeOutlined,
  LineChartOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
  SlidersOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import GerbIcon from '@/shared/assets/icons/gerb.svg';
import { TFunction } from 'i18next';
import { pathToKeyMap, siderStyle } from './sidebar-config';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { hasPermission } from '@/service';
import { _AUTHORITY, _READ_ONLY, _RESPONSIBLE, _SUPER_ADMIN } from '@/service/const/roles';

const { Sider } = Layout;

function generateSidebarItems(t: TFunction, userRole: number) {
  return [
    {
      key: '1',
      label: <Link to={'/'}>{t('Bosh sahifa')}</Link>,
      icon: <HomeOutlined />,
      style: {
        display: hasPermission(userRole, [_RESPONSIBLE, _SUPER_ADMIN, _READ_ONLY])
          ? 'block'
          : 'none',
      },
    },
    {
      key: '2',
      label: <Link to={'/start-assessments'}>{t('Baholashni boshlash')}</Link>,
      icon: <PlusCircleOutlined />,
      style: {
        display: hasPermission(userRole, [_RESPONSIBLE, _SUPER_ADMIN]) ? 'block' : 'none',
      },
    },
    {
      key: '3',
      label: <Link to={'/ongoing-assessments'}>{t('Jarayondagi baholashlar')}</Link>,
      icon: <ReloadOutlined />,
      style: {
        display: hasPermission(userRole, [_RESPONSIBLE, _SUPER_ADMIN]) ? 'block' : 'none',
      },
    },
    {
      key: '4',
      label: <Link to={'/assessment-results'}>{t('Baholash natijalari')}</Link>,
      icon: <LineChartOutlined />,
      style: {
        display: hasPermission(userRole, [_RESPONSIBLE, _SUPER_ADMIN, _READ_ONLY])
          ? 'block'
          : 'none',
      },
    },
    {
      key: '5',
      label: <Link to={'/organizations'}>{t('Tashkilotlar')}</Link>,
      icon: <BankOutlined />,
      style: {
        display: hasPermission(userRole, [_RESPONSIBLE, _SUPER_ADMIN, _READ_ONLY])
          ? 'block'
          : 'none',
      },
    },
    {
      key: '6',
      label: <Link to={'/normative-documents'}>{t('Normativ hujjatlar')}</Link>,
      icon: <FileOutlined />,
      style: {
        display: hasPermission(userRole, [_AUTHORITY, _SUPER_ADMIN]) ? 'block' : 'none',
      },
    },
    {
      key: '7',
      label: <Link to={'/checklist'}>{t('Checklist')}</Link>,
      icon: <CheckOutlined />,
      style: {
        display: hasPermission(userRole, [_AUTHORITY, _SUPER_ADMIN]) ? 'block' : 'none',
      },
    },

    {
      key: '8',
      label: t('Sozlamalar'),
      icon: <SettingOutlined />,
      style: {
        display: hasPermission(userRole, [_SUPER_ADMIN]) ? 'block' : 'none',
      },
      children: [
        {
          key: '8.1',
          label: <Link to={'/settings/indicator-types'}>{t("Ko'rsatkich turlari")}</Link>,
          icon: <SlidersOutlined />,
        },
        {
          key: '8.2',
          label: <Link to={'/settings/indicators'}>{t("Ko'rsatkichlar")}</Link>,
          icon: <GroupOutlined />,
        },
        {
          key: '8.3',
          label: <Link to={'/settings/users'}>{t('Foydalanuvchilar')}</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: '8.4',
          label: <Link to={'/settings/organizations'}>{t('Tashkilotlar')}</Link>,
          icon: <BankOutlined />,
        },
        {
          key: '8.5',
          label: <Link to={'/settings/checklists'}>{t('Checklist')}</Link>,
          icon: <CheckOutlined />,
        },
        {
          key: '8.6',
          label: <Link to={'/settings/normative-documents'}>{t('Normativ hujjatlar')}</Link>,
          icon: <FileOutlined />,
        },
      ],
    },
  ];
}

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { data: profile } = useProfile();
  const userRole = profile?.data?.user?.role || 0;

  const currentPath = location.pathname.split('?')[0] || '/';

  useEffect(() => {
    const keys = pathToKeyMap[currentPath];
    setSelectedKeys(keys);
  }, [currentPath]);

  useEffect(() => {
    setCollapsed(getSidebarCollapsed() || false);
  }, []);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    setSidebarCollapsed(value);
  };

  return (
    <Sider
      style={siderStyle}
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      width={250}
    >
      <div className='h-[98%] overflow-auto'>
        {!collapsed && (
          <div className='flex flex-col items-center mt-4'>
            <Link to={'/'}>
              <img src={GerbIcon} alt='' className='w-20 h-20' />
            </Link>
            <div className='p-4 text-center text-white'>
              <span className='font-bold font-sans'>
                Farmasevtika maxsulotlari xavfsizligi markazi
              </span>{' '}
              davlat muassasasi
            </div>
          </div>
        )}

        <Menu
          theme='dark'
          selectedKeys={selectedKeys}
          mode='inline'
          items={generateSidebarItems(t, userRole)}
        />
      </div>
    </Sider>
  );
}
