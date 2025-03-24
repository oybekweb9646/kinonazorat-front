import { CloudUploadOutlined } from '@ant-design/icons';
import { message, Typography, Form } from 'antd';
import { useState, useEffect } from 'react';
import { api } from '@/service';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface UploadedFile {
  name: string;
  id: string;
  new?: boolean;
}

interface FileUploadProps {
  label?: string;
  accept?: string;
  name: string | [number, string];
  hint?: string;
  rules?: Array<{ [key: string]: any }>;
  disabled?: boolean;
}

const FileUpload = ({ label, accept, name, hint, rules, disabled }: FileUploadProps) => {
  const form = Form.useFormInstance();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const initialValue = form.getFieldValue(name);
    if (initialValue && initialValue.id && initialValue.name) {
      setUploadedFile(initialValue);
    } else {
      setUploadedFile(null);
    }
  }, [form, name]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('file/upload', formData);
      const newFile: UploadedFile = res.data?.data;

      if (newFile && newFile.id && newFile.name) {
        form.setFieldValue(name, newFile);
        setUploadedFile(newFile);
        toast.success(t('File uploaded successfully'));
      } else {
        throw new Error(t('Invalid file data received from server'));
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || t('Upload failed'));
    } finally {
      e.target.value = '';
    }
  };

  return (
    <Form.Item name={name} label={label} rules={rules} noStyle valuePropName='value'>
      <div className='border border-dashed border-[#d9d9d9] rounded-md relative flex flex-col justify-center items-center w-full'>
        <input
          type='file'
          hidden
          accept={accept}
          onChange={handleUpload}
          disabled={disabled}
          id={`file-upload-${name.toString()}`}
        />
        <label
          htmlFor={`file-upload-${name.toString()}`}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
          className='w-full h-full p-4'
        >
          {hint && <Text type='secondary'>{hint}</Text>}
          {!uploadedFile && (
            <div className='flex gap-2 items-center justify-center'>
              <CloudUploadOutlined />
              <span>{t('File biriktirish')}</span>
            </div>
          )}
          {uploadedFile && (
            <div className='flex gap-2 items-center justify-center'>{uploadedFile.name}</div>
          )}
        </label>
      </div>
    </Form.Item>
  );
};

export default FileUpload;
