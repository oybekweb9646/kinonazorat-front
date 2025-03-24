import { Layout } from 'antd';

export default function Footer() {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      Xavfni tahlil qilish ©{new Date().getFullYear()} Created by{' '}
      <a href='https://uzinfocom.uz/' target='_blank' className='!text-blue-500'>
        UZINFOCOM
      </a>
    </Layout.Footer>
  );
}
