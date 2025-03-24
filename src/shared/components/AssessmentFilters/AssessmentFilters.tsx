import { Button, Card, Form, Input, Select } from 'antd';
import { JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import useQuery from '@/shared/hooks/use-query/use-query';
import { useFetch } from '@/shared/hooks';
import { IUseFetchResponse } from '@/shared/types';
import { useDebounce } from 'use-debounce';

type FormFieldType = {
  id: string;
  authority_id: string;
  created_by: string;
  stir: string;
};

export default function AssessmentFilters(): JSX.Element {
  const { t } = useTranslation();
  const { query, setQuery } = useQuery();
  const [form] = Form.useForm();

  const [searchedOrganization, setSearchedOrganization] = useState<string>('');
  const [debouncedSearchedOrganization] = useDebounce(searchedOrganization, 500);

  function onSubmit(values: FormFieldType) {
    setQuery({
      ...query,
      id: values.id,
      authority_id: values.authority_id,
      created_by: values.created_by,
      stir: values.stir,
    });
  }

  const { data: organizations, isFetching } = useFetch<IUseFetchResponse<any[]>>({
    url: '/authority/filter',
    method: 'POST',
    queryKey: 'organizations',
    body: {
      name: debouncedSearchedOrganization,
    },
  });

  const handleClear = () => {
    form.resetFields();
    setSearchedOrganization('');
    setQuery({
      ...query,
      id: '',
      authority_id: '',
      created_by: '',
      stir: '',
    });
  };

  function onSearch(e: string) {
    setSearchedOrganization(e);
  }

  useEffect(() => {
    form.setFieldsValue({
      id: query.id || '',
      authority_id: (query.authority_id && Number(query.authority_id)) || '',
      created_by: query.created_by || '',
      stir: query.stir || '',
    });
  }, [form, query]);
  return (
    <Card>
      <Form form={form} onFinish={onSubmit} name='rating-results' layout='inline'>
        <div className='grid grid-cols-2 gap-4 w-full'>
          {/* <Form.Item<FormFieldType> name='id'>
            <Input type='number' placeholder={t('ID')} allowClear />
          </Form.Item> */}
          <Form.Item<FormFieldType> name='authority_id'>
            <Select
              options={organizations?.data?.map((item) => ({ label: item.name, value: item.id }))}
              placeholder={t('Tashkilot')}
              loading={isFetching}
              allowClear
              filterOption={false}
              showSearch
              onSearch={onSearch}
            />
          </Form.Item>
          <Form.Item<FormFieldType> name='stir'>
            <Input placeholder={t('Stir')} allowClear />
          </Form.Item>
          <Form.Item<FormFieldType> name='created_by'>
            <Input placeholder={t('Yaratuvchisi')} allowClear />
          </Form.Item>

          <Form.Item<FormFieldType> label={null}>
            <div className='flex gap-4'>
              <Button type='primary' htmlType='submit' className='w-1/2' icon={<SearchOutlined />}>
                {t('Qidirish')}
              </Button>
              <Button
                type='primary'
                htmlType='button'
                onClick={handleClear}
                danger
                className='w-1/2'
                icon={<ClearOutlined />}
              >
                {t('Tozalash')}
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
