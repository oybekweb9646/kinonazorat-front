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
          colorSuccess: '#66bb6a',
          colorError: '#f44336',
          colorWarning: '#ffc107',
          colorInfo: '#0dcaf0',
        },
        components: {
          Menu: {
            colorPrimary: '#00738A',
            // colorBgMask: '#014158',
            colorBgContainer: '#003a4f',
            colorText: '#fff',
            colorPrimaryActive: '#00738A',
            colorPrimaryTextActive: '#00738A',
            colorPrimaryHover: '#00738A',
            colorPrimaryTextHover: '#00738A',
            // colorBgTextActive: '#014158',
          },
          Button: {
            colorPrimary: '#00738A',
            colorPrimaryHover: '#00738A',
            colorPrimaryActive: '#014158',
            borderRadius: 50,
          },
          Input: {
            colorPrimary: '#00738A',
            colorPrimaryHover: '#00738A',
            borderRadius: 50,
          },
          Select: {
            borderRadius: 50,
            colorPrimary: '#00738A',
          },
          Switch: {
            colorPrimary: '#07bc0c',
            colorBgContainer: '#d9d9d9',
            colorPrimaryHover: '#07bc0c',
          },
          Checkbox: {
            colorPrimary: '#07bc0c',
            // colorBgContainer: '#d9d9d9',
            colorPrimaryHover: '#07bc0c',
          },
          Radio: {
            colorPrimary: '#00738A',
            // colorBgContainer: '#d9d9d9',
            colorPrimaryHover: '#00738A',
          },
          Table: {
            headerBg: '#014158',
            headerColor: '#fff',
            footerBg: '#014158',
            footerColor: '#fff',
          },
          Spin: {
            colorPrimary: '#014158',
          },

          Pagination: {
            itemActiveBg: '#014158',
            itemLinkBg: '#fff',
            colorBgContainer: '#fff',
          },

          Card: {
            headerBg: '#014158',
            colorTextHeading: '#fff',
          },
          Modal: {
            titleColor: '#014158',
          },
          Form: {
            labelColor: '#014158',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
