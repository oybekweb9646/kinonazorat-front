import { Pagination as AntdPagination, PaginationProps } from 'antd';
import useQuery from '@/shared/hooks/use-query/use-query';
import { useTranslation } from 'react-i18next';

type PropsType = {
  currentPage?: number;
  total?: number;
  pageName?: string;
  pageSizeName?: string;
  showSizeChanger?: boolean;
  defaultPageSize?: number;
  hideOnSinglePage?: boolean;
  additionalPageSizeOptions?: number[];
} & Partial<PaginationProps>;

export default function Pagination({
  currentPage,
  total,
  pageName = 'page',
  pageSizeName = 'page_size',
  showSizeChanger = true,
  defaultPageSize = 20,
  hideOnSinglePage = false,
  additionalPageSizeOptions = [10, 20, 50],
  ...props
}: PropsType) {
  const { query, setQuery } = useQuery();
  const { t } = useTranslation();

  function handleChangePage(page: number, pageSize: number) {
    setQuery({ ...query, [pageName]: page.toString(), [pageSizeName]: pageSize.toString() }, false);
  }

  return (
    <AntdPagination
      hideOnSinglePage={hideOnSinglePage}
      current={currentPage || 1}
      total={total || 0}
      pageSize={Number(query[pageSizeName]) || defaultPageSize}
      onChange={handleChangePage}
      onShowSizeChange={handleChangePage}
      showSizeChanger={showSizeChanger}
      pageSizeOptions={additionalPageSizeOptions.map(String)}
      locale={{
        items_per_page: t('tadan'),
        prev_page: t('Orqaga'),
        next_page: t('Oldinga'),
      }}
      {...props}
    />
  );
}
