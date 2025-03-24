import { getToken } from '@/service/storage';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes: React.FC = () => {
  return getToken() ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoutes;
