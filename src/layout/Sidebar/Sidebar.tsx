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
import {
  _AUTHORITY,
  _READ_ONLY,
  _RESPONSIBLE,
  _SUPER_ADMIN,
  _TERRITORIAL_RESPONSIBLE,
} from '@/service/const/roles';

const { Sider } = Layout;

function generateSidebarItems(t: TFunction, userRole: number) {
  return [
    {
      key: '1',
      label: <Link to={'/'}>{t('Bosh sahifa')}</Link>,
      icon: <HomeOutlined />,
      style: {
        display: hasPermission(userRole, [
          _RESPONSIBLE,
          _TERRITORIAL_RESPONSIBLE,
          _SUPER_ADMIN,
          _READ_ONLY,
        ])
          ? 'block'
          : 'none',
      },
    },
    {
      key: '2',
      label: <Link to={'/start-assessments'}>{t('Baholashni boshlash')}</Link>,
      icon: <PlusCircleOutlined />,
      style: {
        display: hasPermission(userRole, [_RESPONSIBLE, _TERRITORIAL_RESPONSIBLE, _SUPER_ADMIN])
          ? 'block'
          : 'none',
      },
    },
    {
      key: '3',
      label: <Link to={'/ongoing-assessments'}>{t('Jarayondagi baholashlar')}</Link>,
      icon: <ReloadOutlined />,
      style: {
        display: hasPermission(userRole, [_RESPONSIBLE, _TERRITORIAL_RESPONSIBLE, _SUPER_ADMIN])
          ? 'block'
          : 'none',
      },
    },
    {
      key: '4',
      label: <Link to={'/assessment-results'}>{t('Baholash natijalari')}</Link>,
      icon: <LineChartOutlined />,
      style: {
        display: hasPermission(userRole, [
          _RESPONSIBLE,
          _TERRITORIAL_RESPONSIBLE,
          _SUPER_ADMIN,
          _READ_ONLY,
        ])
          ? 'block'
          : 'none',
      },
    },
    {
      key: '5',
      label: <Link to={'/organizations'}>{t('Tashkilotlar')}</Link>,
      icon: <BankOutlined />,
      style: {
        display: hasPermission(userRole, [
          _RESPONSIBLE,
          _TERRITORIAL_RESPONSIBLE,
          _SUPER_ADMIN,
          _READ_ONLY,
        ])
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
    // {
    //   key: '7',
    //   label: <Link to={'/checklist'}>{t('Checklist')}</Link>,
    //   icon: <CheckOutlined />,
    //   style: {
    //     display: hasPermission(userRole, [_AUTHORITY, _SUPER_ADMIN]) ? 'block' : 'none',
    //   },
    // },

    {
      key: '7',
      label: t('Sozlamalar'),
      icon: <SettingOutlined />,
      style: {
        display: hasPermission(userRole, [_SUPER_ADMIN]) ? 'block' : 'none',
      },
      children: [
        {
          key: '7.1',
          label: <Link to={'/settings/indicator-types'}>{t("Ko'rsatkich turlari")}</Link>,
          icon: <SlidersOutlined />,
        },
        {
          key: '7.2',
          label: <Link to={'/settings/indicators'}>{t("Ko'rsatkichlar")}</Link>,
          icon: <GroupOutlined />,
        },
        {
          key: '7.3',
          label: <Link to={'/settings/users'}>{t('Foydalanuvchilar')}</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: '7.4',
          label: <Link to={'/settings/organizations'}>{t('Tashkilotlar')}</Link>,
          icon: <BankOutlined />,
        },
        {
          key: '7.5',
          label: <Link to={'/settings/checklists'}>{t('Checklist')}</Link>,
          icon: <CheckOutlined />,
        },
        {
          key: '7.6',
          label: <Link to={'/settings/normative-documents'}>{t('Normativ hujjatlar')}</Link>,
          icon: <FileOutlined />,
        },
      ],
    },
  ];
}

export default function Sidebar({ collapsed, handleCollapse }: any) {
  const { t } = useTranslation();
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { data: profile } = useProfile();
  const userRole = profile?.data?.user?.role || 0;
  const homePath = userRole === _AUTHORITY ? '/normative-documents' : '/';

  const currentPath = location.pathname.split('?')[0] || '/';

  useEffect(() => {
    const keys = pathToKeyMap[currentPath];
    setSelectedKeys(keys);
  }, [currentPath]);

  return (
    <Sider
      style={siderStyle}
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      width={280}
      trigger={null}
    >
      <div className='h-[98%] overflow-auto'>
        {!collapsed && (
          <div className='flex flex-col items-center mt-4'>
            <Link to={homePath}>
              <img src={GerbIcon} alt='' className='w-20 h-20' />
            </Link>
            <div className='p-4 text-center text-white font-bold'>
              Oʻzbekiston Respublikasi Prezidenti Administratsiyasi huzuridagi Axborot va ommaviy
              kommunikatsiyalar agentligi
            </div>
          </div>
        )}

        <Menu
          theme='dark'
          selectedKeys={selectedKeys}
          mode='inline'
          items={generateSidebarItems(t, userRole)}
          style={{ backgroundColor: '#003a4f' }}
        />
      </div>
    </Sider>
  );
}
