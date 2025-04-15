import { useMutation } from '@/shared/hooks';
import { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function UploadIndicatorFile({ item }: any): JSX.Element {
  const { t } = useTranslation();
  const { mutate: uploadFile, isPending } = useMutation({ mutationKey: 'upload-file' });
  const { mutate: setFile } = useMutation({ mutationKey: 'set-file' });
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    uploadFile(
      {
        url: 'file/upload',
        data: formData,
        method: 'POST',
      },
      {
        onSuccess: (data: any) => {
          handleSetFile(data.data);
          setUploadedFile(data.data);
        },
      },
    );
  };

  const handleSetFile = (data: any) => {
    setFile(
      {
        url: `score-indicator-request/set-file/${item.id}`,
        data: {
          file_id: data.id,
        },
        method: 'POST',
      },
      {
        onSuccess: () => {
          toast.success(t('File uploaded successfully'));
        },
      },
    );
  };

  return (
    <div className='border-gray-300 border rounded-md flex items-center px-4 py-1 border-dashed'>
      <input
        type='file'
        onChange={handleUpload}
        id={`file-upload-${item.id}`}
        style={{ display: 'none' }}
      />
      <label htmlFor={`file-upload-${item.id}`} className='w-full h-full'>
        <div className='flex gap-2 items-center justify-center'>
          {isPending ? <Spin indicator={<LoadingOutlined spin />} /> : <UploadOutlined />}
          {!uploadedFile ? (
            <span>{t('Fayl biriktirish')}</span>
          ) : (
            <span className='max-w-[150px] line-clamp-1'>{uploadedFile?.name}</span>
          )}
        </div>
      </label>
    </div>
  );
}
