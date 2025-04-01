import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Table, theme } from 'antd';
import useQuery from '@/shared/hooks/use-query/use-query';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponse } from '@/shared/types';
import Pagination from '@/shared/components/core/Pagination/Pagination';

const { Column } = Table;

interface IOrganization {
  auth_type: string;
  authority_id: null | number;
  created_at: string;
  date_of_birth: null | string;
  egov_token: null | string;
  full_name: null | string;
  id: number;
  is_juridical: boolean;
  phone: null | string;
  pin_fl: string;
  position_name: null | string;
  role: string;
  status: number;
  stir: null | string;
  updated_at: string;
  username: string;
}

export default function Organizations(): JSX.Element {
  const { t } = useTranslation();
  const { query, setQuery } = useQuery();
  const {
    token: { colorSuccess, colorError },
  } = theme.useToken();

  const { data: organizations, isFetching } = useFetch<IUseFetchResponse<IOrganization[]>>({
    url: '/authority/filter',
    method: 'POST',
    queryKey: 'organizations',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
    body: {
      is_checked_checklist: query.filterBy === 'checklist' ? true : undefined,
      is_checked_question: query.filterBy === 'question' ? true : undefined,
    },
  });
  return (
    <div>
      <h3 className='page-title'>{t('Tashkilotlar')}</h3>
      <Select
        options={[
          { value: 'checklist', label: t("Checklistdan o'tkazilgan") },
          { value: 'question', label: t("Profilaktikadan o'tkazilgan") },
        ]}
        className='w-full mb-4'
        onChange={(value) => {
          setQuery({ ...query, filterBy: value });
        }}
        value={query.filterBy}
        allowClear
      />
      <Table
        className='mt-4'
        bordered
        dataSource={organizations?.data}
        pagination={false}
        loading={isFetching}
        footer={() => {
          return (
            <Pagination
              total={organizations?.total}
              currentPage={organizations?.current_page}
              align='end'
            />
          );
        }}
      >
        <Column align='center' title={t('ID')} dataIndex={'id'} />
        <Column title={t('Tashkilot nomi')} dataIndex='name' key='name' />
        <Column align='center' title={t('Stir')} dataIndex='stir' key='stir' />
        {/* <Column
          align='center'
          title={t("Checklist dan o'tkazilganligi")}
          onCell={(record) => {
            return {
              style: {
                backgroundColor: record.is_checked_checklist ? colorSuccess : colorError,
                color: 'white',
              },
            };
          }}
          render={(item) => {
            return item.is_checked_checklist
              ? t("Checklist dan o'tkazilgan")
              : t("Checklist dan o'tkazilmagan");
          }}
        /> */}
        <Column
          align='center'
          title={t("Profilaktikadan o'tkazilganligi")}
          onCell={(record) => {
            return {
              style: {
                backgroundColor: record.is_checked_question ? colorSuccess : colorError,
                color: 'white',
              },
            };
          }}
          render={(item) => {
            return item.is_checked_question
              ? t("Profilaktikadan o'tkazilgan")
              : t("Profilaktikadan o'tkazilmagan");
          }}
        />
      </Table>
    </div>
  );
}
