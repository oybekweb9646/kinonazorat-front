import { Spin, Table } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch, useMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import OrganizationForm from './components/OrganizationForm';
import { FormStateTypes, IUseFetchResponse } from '@/shared/types';
import useQuery from '@/shared/hooks/use-query/use-query';
import Pagination from '@/shared/components/core/Pagination/Pagination';
import DeleteOrganizationConfirmation from './components/DeleteOrganizationConfirmation';
import * as XLSX from 'xlsx';
import { PlusOutlined } from '@ant-design/icons';

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

const OrganizationsList: React.FC = () => {
  const { t } = useTranslation();
  const { query } = useQuery();
  const [formModal, setFormModal] = useState<FormStateTypes>({
    open: false,
    type: 'create',
    item: null,
  });

  const [deleteModal, setDeleteModal] = useState<FormStateTypes>({
    open: false,
    item: null,
  });

  const { mutate, isPending } = useMutation({ mutationKey: 'add-organization' });
  const queryClient = useQueryClient();

  const [jsonData, setJsonData] = useState<any>([]);

  // Expected headers

  const { data: organizations, isFetching } = useFetch<IUseFetchResponse<IOrganization[]>>({
    url: '/authority/filter',
    method: 'POST',
    queryKey: 'organizations',
    params: {
      page: query.page || 1,
      size: query.page_size || 20,
    },
    body: {
      is_juridical: true,
    },
  });

  const expectedHeaders = ['Tashkilot nomi', 'Tashkilot inn', 'Tashkilot manzili'];

  const headerMapping: { [key: string]: string } = {
    'Tashkilot nomi': 'authority_name',
    'Tashkilot inn': 'authority_inn',
    'Tashkilot manzili': 'authority_address',
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (rows.length < 3) {
        toast.error("Xatolik: Faylda yetarlicha ma'lumot yo‘q!");
        return;
      }

      const title = rows[0][1] as string;
      const headers = rows[1];

      // Validate headers
      if (!expectedHeaders.every((header, index) => headers[index] === header)) {
        toast.error('Xatolik: Ustun nomlari noto‘g‘ri yoki tartib buzilgan!');
        return;
      }

      const formattedHeaders = headers.map(
        (header: string) => headerMapping[header.trim()] || header.trim(),
      );

      const data = rows.slice(2).map((row: any[]) => {
        const obj: { [key: string]: any } = {};
        formattedHeaders.forEach((newHeader: string, index: number) => {
          obj[newHeader] = row[index] || null;
        });
        return obj;
      });

      setJsonData({ title, data });

      event.target.value = '';

      handleSend();
    };
  };

  function handleSend() {
    mutate(
      {
        url: '/authority/excel-upload',
        method: 'POST',
        data: jsonData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['organizations'] });
          toast.success(t("Tashkilotlar qo'shildi"));
        },
      },
    );
  }

  return (
    <div>
      {isPending && <Spin size='large' fullscreen />}
      <div className='flex justify-between gap-4'>
        <h3 className='page-title'>{t('Tashkilotlar')}</h3>
        <div>
          <input
            type='file'
            accept='.xlsx, .xls'
            id='xlsx_file'
            onChange={handleFileUpload}
            hidden
          />
          <label
            className='border border-gray-400 px-3 py-2 cursor-pointer rounded-[50px]'
            htmlFor='xlsx_file'
          >
            <PlusOutlined /> {t("Qo'shish")}
          </label>
        </div>
      </div>

      <Table
        dataSource={organizations?.data}
        pagination={false}
        loading={isFetching}
        bordered
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
        <Column align='center' title={t('ID')} dataIndex='id' />
        <Column align='center' title={t('Tashkilot nomi')} dataIndex='name' />
        <Column align='center' title={t('Stir')} dataIndex={'stir'} />
      </Table>

      {formModal.open && (
        <OrganizationForm
          open={formModal.open}
          onCancel={() => setFormModal({ open: false })}
          item={formModal.item}
          type={formModal.type}
        />
      )}

      {deleteModal.open && (
        <DeleteOrganizationConfirmation
          open={deleteModal.open}
          onCancel={() => setDeleteModal({ open: false })}
          item={deleteModal.item}
        />
      )}
    </div>
  );
};

export default OrganizationsList;
