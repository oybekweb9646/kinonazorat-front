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

const GREEN = {
  base: '#1B3A2D',    // sidebar
  mid: '#24503E',     // jadval sarlavhasi, card header
  primary: '#2E7D52', // tugmalar
  hover: '#3A9E68',   // hover
  active: '#14301F',  // active
};

export default function AntdWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={localeMap[i18n.language || 'uz']}
      theme={{
        token: {
          colorBgContainer: '#fff',
          colorPrimary: GREEN.primary,
          colorSuccess: '#66bb6a',
          colorError: '#f44336',
          colorWarning: '#ffc107',
          colorInfo: '#0dcaf0',
        },
        components: {
          Menu: {
            colorPrimary: GREEN.primary,
            colorBgContainer: GREEN.base,
            colorText: '#fff',
            colorPrimaryActive: GREEN.hover,
            colorPrimaryTextActive: GREEN.hover,
            colorPrimaryHover: GREEN.hover,
            colorPrimaryTextHover: GREEN.hover,
            colorBgTextActive: GREEN.mid,
            colorBgSolidHover: GREEN.mid,
            darkPopupBg: GREEN.mid,
            colorBgElevated: GREEN.mid,
            popupBg: GREEN.mid,
            subMenuItemBg: GREEN.mid,
            darkSubMenuItemBg: GREEN.mid,
          },
          Button: {
            colorPrimary: GREEN.primary,
            colorPrimaryHover: GREEN.hover,
            colorPrimaryActive: GREEN.active,
            borderRadius: 50,
          },
          Input: {
            colorPrimary: GREEN.primary,
            colorPrimaryHover: GREEN.hover,
            borderRadius: 50,
          },
          DatePicker: {
            colorPrimary: GREEN.primary,
            colorPrimaryHover: GREEN.hover,
            borderRadius: 50,
          },
          Select: {
            borderRadius: 50,
            colorPrimary: GREEN.primary,
          },
          Switch: {
            colorPrimary: '#07bc0c',
            colorBgContainer: '#d9d9d9',
            colorPrimaryHover: '#07bc0c',
          },
          Checkbox: {
            colorPrimary: '#07bc0c',
            colorPrimaryHover: '#07bc0c',
          },
          Radio: {
            colorPrimary: GREEN.primary,
            colorPrimaryHover: GREEN.hover,
          },
          Table: {
            headerBg: GREEN.mid,
            headerColor: '#fff',
            footerBg: GREEN.mid,
            footerColor: '#fff',
          },
          Spin: {
            colorPrimary: GREEN.mid,
          },
          Pagination: {
            itemActiveBg: GREEN.mid,
            itemLinkBg: '#fff',
            colorBgContainer: '#fff',
          },
          Card: {
            headerBg: GREEN.mid,
            colorTextHeading: '#fff',
          },
          Modal: {
            titleColor: GREEN.base,
          },
          Form: {
            labelColor: GREEN.base,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}