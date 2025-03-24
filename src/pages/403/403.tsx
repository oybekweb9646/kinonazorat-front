import React from 'react';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { _AUTHORITY } from '@/service/const/roles';

const Forbidden: React.FC = () => {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const userRole = profile?.data?.user?.role || 0;
  const redirectUrl = userRole === _AUTHORITY ? '/normative-documents' : '/';
  return (
    <Result
      status='403'
      title='403'
      subTitle={t('Kechirasiz, siz ushbu sahifaga kirish huquqiga ega emassiz.')}
      extra={
        <Link to={redirectUrl}>
          <Button type='primary'>{t('Asosiy sahifaga qaytish')}</Button>
        </Link>
      }
    />
  );
};

export default Forbidden;
