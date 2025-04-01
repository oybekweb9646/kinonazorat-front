export interface IProfileData {
  id: number;
  username: string;
  full_name: string | null;
  pin_fl: number;
  stir: string | null;
  auth_type: string;
  role: number;
  egov_token: string | null;
  date_of_birth: string | null;
  phone: string | null;
  position_name: string | null;
  is_juridical: boolean;
  authority_id: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  authority: any;
  region_id: number;
}

export interface IProfile {
  user: IProfileData;
}
