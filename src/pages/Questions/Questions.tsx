import { useFetch, useMutation } from '@/shared/hooks';
import { IUseFetchResponseList } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { Button, List } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { hasPermission } from '@/service';
import { _AUTHORITY } from '@/service/const/roles';

export default function Questions() {
  const { t } = useTranslation();
  const { mutate } = useMutation({ mutationKey: 'read-question' });
  const { mutate: confirm } = useMutation({
    mutationKey: 'confirm-question',
  });
  const queryClient = useQueryClient();

  const { data: questions, isFetching } = useFetch<IUseFetchResponseList<any[]>>({
    url: '/question/list',
    method: 'GET',
    queryKey: 'question',
  });
  const { data: profile } = useProfile();
  const userRole = profile?.data?.user?.role || 0;

  const handleRead = () => {
    mutate(
      { url: `/question-authority/read`, method: 'GET' },
      {
        onSuccess: () => {
          toast.success(t('Muvaffaqiyatli saqlandi'));
          queryClient.invalidateQueries({ queryKey: ['question'] });
        },
      },
    );
  };

  const handleConfirm = () => {
    confirm(
      { url: `/question-authority/confirm`, method: 'GET' },
      {
        onSuccess: () => {
          toast.success(t('Muvaffaqiyatli saqlandi'));
          queryClient.invalidateQueries({ queryKey: ['question'] });
        },
      },
    );
  };

  const isAllRead = questions?.data.every((item: any) => item.read_authority?.[0]?.id);

  return (
    <div>
      <h3 className='page-title'>{t('Savollar')}</h3>
      <List
        bordered
        loading={isFetching}
        dataSource={questions?.data}
        footer={
          <div className='flex justify-end'>
            {hasPermission(userRole, [_AUTHORITY]) && isAllRead && questions?.data?.length ? (
              <Button type='primary' onClick={handleConfirm} disabled={!isAllRead}>
                {t('Saqlash')}
              </Button>
            ) : (
              ''
            )}
          </div>
        }
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Button
                type='primary'
                onClick={handleRead}
                disabled={item.read_authority?.[0]?.id}
                style={{
                  display: hasPermission(userRole, [_AUTHORITY]) ? '' : 'none',
                }}
              >
                {!item.read_authority?.[0]?.id ? t('Tanishib chiqdim') : t('Tanishib chiqilgan')}
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={<div style={{ fontWeight: 'bold' }}>{item.title}</div>}
              description={
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
                >
                  {item.desc}
                </ReactMarkdown>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
