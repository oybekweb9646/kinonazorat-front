import { useFetch, useMutation } from '@/shared/hooks';
import useQuery from '@/shared/hooks/use-query/use-query';
import { IIndicatorType, IUseFetchResponseList } from '@/shared/types';
import { Card, Form, Radio, Spin } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AssessmentTypes = ({ organizationData }: any) => {
  const { query, setQuery } = useQuery();
  const { t } = useTranslation();
  const { mutate } = useMutation({ mutationKey: 'request-create' });
  const [form] = Form.useForm();

  const { data: indicatorTypes, isFetching } = useFetch<IUseFetchResponseList<IIndicatorType[]>>({
    url: '/indicator-type/list',
    method: 'GET',
    queryKey: 'indicator-types',
  });

  function onFinish(values: any) {
    mutate(
      {
        url: '/request/create',
        data: {
          indicator_type_id: values.indicator_type_id,
          authority_id: organizationData?.id,
        },
      },
      {
        onSuccess: (data: any) => {
          setQuery({
            ...query,
            indicator_type_id: values.indicator_type_id,
            request_id: data.data.id,
          });
        },
      },
    );
  }

  useEffect(() => {
    if (query.indicator_type_id) {
      form.setFieldsValue({
        indicator_type_id: Number(query.indicator_type_id),
      });
    }
  }, [query.indicator_type_id, form]);

  return (
    <Spin spinning={isFetching}>
      <Card title={organizationData?.name}>
        <Form
          layout='horizontal'
          form={form}
          initialValues={{
            indicator_type_id: query.indicator_type_id && Number(query.indicator_type_id),
          }}
          onValuesChange={onFinish}
        >
          <Form.Item
            name={'indicator_type_id'}
            rules={[{ required: true, message: t("Ko'rsatkich turi majburiy") }]}
          >
            <Radio.Group
              block
              options={
                indicatorTypes?.data?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) || []
              }
              optionType='button'
              buttonStyle='outline'
            />
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AssessmentTypes;
