import { Button, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ExportColumn, useExport } from '@/shared/hooks/use-export/use-export';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { _PROKUROR, _SUPER_ADMIN } from '@/service/const/roles';
import { JSX } from 'react';

interface ExportButtonsProps {
  data: any[];
  columns: ExportColumn[];
  filename: string;
  title?: string;
}

const CAN_EXPORT = [_SUPER_ADMIN, _PROKUROR];

export default function ExportButtons({ data, columns, filename, title }: ExportButtonsProps): JSX.Element | null {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const userRole = profile?.data?.user?.role;

  const { exportXlsx, exportDocx, exportPdf } = useExport({ data, columns, filename, title });

  if (!CAN_EXPORT.includes(userRole ?? 0)) return null;

  const items = [
    {
      key: 'xlsx',
      label: t('Excel (.xlsx)'),
      onClick: exportXlsx,
    },
    {
      key: 'pdf',
      label: t('PDF (.pdf)'),
      onClick: exportPdf,
    },
    {
      key: 'docx',
      label: t('Word (.docx)'),
      onClick: exportDocx,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement='bottomRight'>
      <Button icon={<DownloadOutlined />}>
        {t('Yuklab olish')}
      </Button>
    </Dropdown>
  );
}