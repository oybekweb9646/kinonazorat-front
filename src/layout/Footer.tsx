import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Layout.Footer style={{ textAlign: 'center', backgroundColor: '#fff' }}>
      {t('Xavfni tahlil qilish tizimi')} ©{new Date().getFullYear()} Created by{' '}
      <a href='https://uzinfocom.uz/' target='_blank' className='!text-blue-500'>
        UZINFOCOM
      </a>
    </Layout.Footer>
  );
}
