import { Modal, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation } from '@/shared/hooks';
import { toast } from 'react-toastify';
import useQuery from '@/shared/hooks/use-query/use-query';
import { useQueryClient } from '@tanstack/react-query';

const ConfirmFinishing = ({
  isModalOpen,
  handleCancel,
  data,
}: {
  isModalOpen: boolean;
  handleCancel: () => void;
  data: any;
}) => {
  const { t } = useTranslation();
  const { query, setQuery } = useQuery();
  const queryClient = useQueryClient();

  const {
    token: { colorSuccess },
  } = theme.useToken();
  const { mutate, isPending } = useMutation({ mutationKey: 'confirm-finishing' });

  function onOk() {
    mutate(
      {
        url: `/request/scored/${data.id}`,
        method: 'GET',
      },
      {
        onSuccess: () => {
          handleCancel();
          toast.success(t('Muvaffaqiyatli saqlandi'));
          setQuery({ ...query, request_id: '', indicator_type_id: '', stir: '' });
          queryClient.invalidateQueries({ queryKey: ['request-indicators'] });
        },
      },
    );
  }
  return (
    <Modal
      title={t('Yakunlashni bajarishga rozimisiz?')}
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={onOk}
      okText={t('Tasdiqlash')}
      cancelText={t('Bekor qilish')}
      confirmLoading={isPending}
      okButtonProps={{
        type: 'primary',
        style: { background: colorSuccess },
        icon: <SaveOutlined />,
      }}
      cancelButtonProps={{ type: 'primary', danger: true, icon: <CloseOutlined /> }}
      maskClosable={false}
    ></Modal>
  );
};

export default ConfirmFinishing;
