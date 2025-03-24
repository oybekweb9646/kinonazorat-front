import { api } from '@/service';
import { _AUTHORITY } from '@/service/const/roles';
import { setToken } from '@/service/storage';
import useQuery from '@/shared/hooks/use-query/use-query';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Auth() {
  const { query } = useQuery();
  const navigate = useNavigate();

  async function getProfile() {
    try {
      const { data } = await api.get('/user/detail');

      if (data.data.user.role === _AUTHORITY) {
        navigate('/normative-documents');
      } else {
        navigate('/');
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function login() {
    try {
      const response = await api.get('/auth/login-by-one-id', { params: { code: query.code } });
      setToken(response.data.data.access_token);
      getProfile();
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  useEffect(() => {
    if (query.code && query.state) {
      if (query.state === sessionStorage.getItem('oneIdState')) {
        // api.get('/auth/login-by-one-id', { params: { code: query.code } }).then((response) => {
        //   setToken(response.data.data.access_token);
        //   getProfile();
        // });
        login();
      } else {
        toast.error('Invalid auth state parameter');
      }
    } else {
      toast.error('Required params is not provided!');
      navigate('/login');
    }
  }, [navigate, query]);

  return <Spin spinning={true} size='large' fullscreen />;
}
