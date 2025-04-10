import { Button, Card, Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@ant-design/icons';
import useQuery from '@/shared/hooks/use-query/use-query';

type FieldType = {
  stir: string;
};

const SearchForm: React.FC = () => {
  const { t } = useTranslation();
  const { setQuery, query } = useQuery();
  const onSubmit = (values: FieldType) => {
    setQuery({ stir: values.stir });
  };
  return (
    <Card title={t('Baholashni boshlash')}>
      <Form
        initialValues={{
          stir: query.stir,
        }}
        onFinish={onSubmit}
        className='w-full flex gap-4'
      >
        <Form.Item
          colon={false}
          className='w-full'
          name='stir'
          label={t('STIR')}
          rules={[{ required: true, message: t('Stir majburiy') }]}
        >
          <Input
            type='number'
            allowClear
            placeholder={t('Tashkilot STIR raqamini kiriting')}
            onClear={() => setQuery({ stir: '', indicator_type_id: '', request_id: '' })}
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button icon={<SearchOutlined />} type='primary' htmlType='submit'>
            {t('Qidirish')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SearchForm;
