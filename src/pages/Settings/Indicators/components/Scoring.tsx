import { useFetch, useMutation } from '@/shared/hooks';
import {
  FormModalProps,
  IIndicatorType,
  IUseFetchResponseList,
  TSelectOption,
} from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal, Select, Table } from 'antd';
import { JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const { Column } = Table;

type Indicator = {
  indicator_name: string;
  max_score: number;
};

type FieldType = {
  name_uz: string;
  name_uzc: string;
  name_ru: string;
  type_id: number;
  indicators: Indicator[];
};

interface ExtendedProps extends FormModalProps {
  indicatorTypes: IIndicatorType[];
}

export default function Scoring({
  open,
  onCancel,
  type,
  item,
  indicatorTypes,
}: ExtendedProps): JSX.Element {
  const { t } = useTranslation();
  const [totalScore, setTotalScore] = useState<number>(0);
  const { mutate, isPending } = useMutation({ mutationKey: `indicator-${type}` });
  const [typeId, setTypeId] = useState<number | undefined>();
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const { data: indicatorsList, isFetching } = useFetch<IUseFetchResponseList<any[]>>({
    url: '/indicator/list',
    method: 'GET',
    queryKey: 'indicators',
    params: {
      type_id: typeId,
    },
    queryOptions: {
      enabled: !!typeId,
    },
  });

  const calculateTotalScore = (indicators: Indicator[]) => {
    const total = indicators?.reduce(
      (acc: number, indicator: Indicator) => acc + Number(indicator.max_score || 0),
      0,
    );
    setTotalScore(total);
  };

  useEffect(() => {
    if (indicatorsList?.data) {
      const mappedIndicators = indicatorsList.data.map((indicator) => ({
        indicator_name: indicator.name,
        max_score: indicator.max_score,
        id: indicator.id,
      }));
      form.setFieldsValue({ indicators: mappedIndicators });
      calculateTotalScore(mappedIndicators);
    }
  }, [indicatorsList, form]);

  const handleValuesChange = (_: any, allValues: FieldType) => {
    const indicators = allValues.indicators || [];
    calculateTotalScore(indicators);
    setTypeId(allValues.type_id);
  };

  function onFinish(values: FieldType) {
    if (totalScore > 100) {
      toast.error(t('Umumiy ball 100 dan oshmasligi kerak'));
      return;
    }

    const customData = {
      type_id: values.type_id,
      indicators: values.indicators.map((indicator: any) => ({
        id: indicator.id,
        max_score: indicator.max_score,
      })),
    };

    mutate(
      {
        url: '/indicator/scores',
        data: customData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['indicators'] });
          toast.success('Muvaffaqiyatli saqlandi');
          onCancel();
        },
      },
    );
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values);
      })
      .catch((error) => {
        console.error('Form validation failed:', error);
      });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={isPending}
      title={t("Ko'rsatkichga ball berish")}
      okText={t('Saqlash')}
      cancelText={t('Bekor qilish')}
      width={1000}
    >
      <Form
        form={form}
        name='indicator-form'
        layout='vertical'
        initialValues={{
          type_id: item?.type_id,
          indicators: [],
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item<FieldType>
          name='type_id'
          label={t("Ko'rsatkich turi")}
          rules={[{ required: true, message: t("Ko'rsatkich turi majburiy") }]}
        >
          <Select
            options={indicatorTypes?.map(({ id, name }: TSelectOption) => ({
              label: name,
              value: id,
            }))}
          />
        </Form.Item>

        <Form.List name='indicators'>
          {(fields) => (
            <>
              <Table
                bordered
                loading={isFetching}
                dataSource={fields.map((field) => ({
                  key: field.key,
                  ...form.getFieldValue('indicators')[field.name],
                }))}
                pagination={false}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <b>{t('Umumiy ball')}</b>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align='center' index={1} colSpan={2}>
                      {totalScore ? <b>{totalScore}</b> : ''}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              >
                <Column align='center' title='#' render={(_, __, index) => index + 1} />
                <Column
                  title={t("Xavf darajasini baholash ko'rsatkichi")}
                  dataIndex='indicator_name'
                />
                <Column
                  align='center'
                  title={t('Ball')}
                  render={(_, __, index) => (
                    <Form.Item
                      name={[index, 'max_score']}
                      rules={[{ required: true, message: t('Score is required') }]}
                      noStyle
                    >
                      <Input type='number' placeholder={t('Ball')} />
                    </Form.Item>
                  )}
                />
              </Table>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
