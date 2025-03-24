import React, { JSX } from 'react';
import { ConfigProvider } from 'antd';
import uzUZ from 'antd/locale/uz_UZ';
import ruRU from 'antd/locale/ru_RU';
import 'dayjs/locale/uz';
import 'dayjs/locale/uz-latn';
import 'dayjs/locale/ru';
import { useTranslation } from 'react-i18next';

type localeMapType = {
  [key: string]: any;
};

const localeMap: localeMapType = {
  uz: uzUZ,
  uzc: uzUZ,
  ru: ruRU,
};

export default function AntdWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={localeMap[i18n.language || 'uz']}
      theme={{
        token: {
          colorBgContainer: '#fff',
          colorPrimary: '#0d6efd',
          colorSuccess: '#198754',
          colorError: '#dc3545',
          colorWarning: '#ffc107',
          colorInfo: '#0dcaf0',
        },
        components: {
          Button: {
            colorPrimary: '#6A89A7',
            colorPrimaryHover: '#6A89A7',
            colorPrimaryActive: '#002140',
          },
          Switch: {
            colorPrimary: '#198754',
            colorBgContainer: '#d9d9d9',
            colorPrimaryHover: '#198754',
          },
          Checkbox: {
            colorPrimary: '#198754',
            // colorBgContainer: '#d9d9d9',
            colorPrimaryHover: '#198754',
          },
          Radio: {
            colorPrimary: '#6A89A7',
            // colorBgContainer: '#d9d9d9',
            colorPrimaryHover: '#6A89A7',
          },
          Table: {
            headerBg: '#002140',
            headerColor: '#fff',
            footerBg: '#002140',
            footerColor: '#fff',
          },
          Spin: {
            colorPrimary: '#002140',
          },

          Pagination: {
            itemActiveBg: '#002140',
            itemLinkBg: '#fff',
            colorBgContainer: '#fff',
          },

          Card: {
            headerBg: '#002140',
            colorTextHeading: '#fff',
          },
          Modal: {
            titleColor: '#002140',
          },
          Form: {
            labelColor: '#002140',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
