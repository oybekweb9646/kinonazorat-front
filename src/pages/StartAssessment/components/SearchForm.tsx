import { Card, Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useQuery from '@/shared/hooks/use-query/use-query';

type FieldType = {
  stir: string;
};

const SearchForm: React.FC = () => {
  const { t } = useTranslation();
  const { setQuery, query } = useQuery();
  const [form] = Form.useForm();

  const onSubmit = (values: FieldType) => {
    setQuery({
      stir: values.stir,
    });
  };

  const handleClear = () => {
    form.resetFields([
      {
        stir: '',
      },
    ]);
    setQuery({
      stir: '',
      indicator_type_id: '',
      request_id: '',
    });
  };
  return (
    <Card title={t('Baholashni boshlash')}>
      <Form
        initialValues={{
          stir: query.stir,
        }}
        onFinish={onSubmit}
        className='w-full flex gap-4'
        form={form}
      >
        <Form.Item
          colon={false}
          className='w-full'
          name='stir'
          label={t('STIR')}
          rules={[{ required: true, message: t('Stir majburiy') }]}
        >
          <Input.Search
            type='number'
            allowClear
            placeholder={t('Tashkilot STIR raqamini kiriting')}
            onSearch={() => form.submit()}
            onClear={handleClear}
            enterButton={t('Qidirish')}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SearchForm;
