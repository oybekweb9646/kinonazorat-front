import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { Spin } from 'antd';
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  allowedRoles: number[];
}

export default function RoleGuard({ children, allowedRoles }: Props): JSX.Element {
  const { data: profile, isFetching, isFetched } = useProfile();

  if (isFetching) {
    return <Spin spinning={true} size='large' fullscreen />;
  }

  if (isFetched && !allowedRoles.includes(profile?.data?.user?.role || 0)) {
    return <Navigate to={'/403'} replace />;
  } else {
    return children;
  }
}
