export type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type TObject = Record<string, unknown>;

export type TLinks = {
  active: string;
  label: string;
  url: null | string;
};
export interface IUseFetchResponse<TItems = TObject> {
  current_page: number;
  data: TItems;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: null | string;
  links: TLinks[];
  next_page_url: null | string;
  path: string;
  per_page: number;
  prev_page_url: null | string;
  to: number;
  total: number;
}

export interface IUseFetchResponseList<TItems = TObject> {
  data: TItems;
  code: number;
  message: string;
  success: boolean;
}

export type TSelectOption = { id: number; name: string };

export interface FormModalProps {
  open: boolean;
  onCancel: () => void;
  type?: 'create' | 'update';
  item?: any;
}

export interface FormStateTypes {
  open?: boolean;
  type?: 'create' | 'update';
  item?: any;
}

export interface IIndicatorType {
  created_at: string;
  id: number;
  name: string;
}
