import { useFetch, useMutation } from '@/shared/hooks';
import { IUseFetchResponseList } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Select, Space, Switch, Tooltip } from 'antd';
import { CopyOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface IIntegrationSettings {
  api_token: string;
  ip_check_enabled: boolean;
  allowed_ips: string[];
}

export default function IntegrationSettingsCard() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isFetching } = useFetch<IUseFetchResponseList<IIntegrationSettings>>({
    url: '/integration-admin/settings',
    method: 'GET',
    queryKey: 'integration-settings',
  });

  const settings = data?.data;

  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        ip_check_enabled: settings.ip_check_enabled,
        allowed_ips: settings.allowed_ips,
      });
    }
  }, [settings]);

  const { mutate: save, isPending: saving } = useMutation({ mutationKey: 'integration-settings-save' });
  const { mutate: regenerate, isPending: regenerating } = useMutation({
    mutationKey: 'integration-regenerate',
  });

  function onSave(values: { ip_check_enabled: boolean; allowed_ips: string[] }) {
    save(
      { url: '/integration-admin/settings', data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['integration-settings'] });
          toast.success(t('Sozlama saqlandi'));
        },
      },
    );
  }

  function onRegenerate() {
    regenerate(
      { url: '/integration-admin/regenerate-token' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['integration-settings'] });
          toast.success(t('Token yangilandi'));
        },
      },
    );
  }

  function copyToken() {
    if (settings?.api_token) {
      navigator.clipboard.writeText(settings.api_token);
      toast.success(t('Nusxalandi'));
    }
  }

  return (
    <Card title={t('Integratsiya sozlamalari')} loading={isFetching}>
      <div className='mb-5'>
        <label className='block mb-1 font-medium'>{t('API token')}</label>
        <Space.Compact className='w-full'>
          <Input.Password value={settings?.api_token} readOnly />
          <Tooltip title={t('Nusxalash')}>
            <Button icon={<CopyOutlined />} onClick={copyToken} />
          </Tooltip>
          <Button danger icon={<ReloadOutlined />} loading={regenerating} onClick={onRegenerate}>
            {t('Yangilash')}
          </Button>
        </Space.Compact>
        <p className='text-xs text-gray-400 mt-1'>
          {t('Tokenni MSPD ga xavfsiz kanal orqali bering (Authorization: Bearer yoki X-Api-Token).')}
        </p>
      </div>

      <Form form={form} layout='vertical' onFinish={onSave}>
        <Form.Item
          name='ip_check_enabled'
          label={t('IP cheklovi')}
          valuePropName='checked'
          extra={t("O'chirilsa — faqat token tekshiriladi (token-only rejimi).")}
        >
          <Switch checkedChildren={t('Yoqilgan')} unCheckedChildren={t("O'chirilgan")} />
        </Form.Item>

        <Form.Item
          name='allowed_ips'
          label={t('Ruxsat etilgan IP manzillar')}
          extra={t("Enter bilan qo'shing. Masalan: 10.190.0.102")}
        >
          <Select
            mode='tags'
            tokenSeparators={[',', ' ']}
            className='w-full'
            placeholder='10.190.0.102'
            open={false}
            suffixIcon={null}
          />
        </Form.Item>

        <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={saving}>
          {t('Saqlash')}
        </Button>
      </Form>
    </Card>
  );
}
