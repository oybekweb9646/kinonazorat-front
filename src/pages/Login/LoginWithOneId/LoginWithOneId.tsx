import React from 'react';
import GerbIcon from '@/shared/assets/icons/gerb.svg';
import QueryString from 'qs';
import { Button } from 'antd';

const generateOneIdUrl = () => {
  const oneIdState = Date.now() + Math.random();

  sessionStorage.setItem('oneIdState', String(oneIdState));

  const query = QueryString.stringify({
    client_id: 'pharmtahlil_uz',
    response_type: 'one_code',
    scope: 'pharmtahlil_uz',
    redirect_uri: `https://pharmtahlil.uz/auth`,
    state: oneIdState,
  });

  const oneIdUrl = `https://sso.egov.uz/sso/oauth/Authorization.do?${query}`;

  return oneIdUrl;
};

const LoginWithOneId: React.FC = () => {
  const oneIdUrl = generateOneIdUrl();
  const handleClickOneId = () => {
    window.location.href = oneIdUrl;
  };
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col gap-4 items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-md p-6 max-w-md w-full flex flex-col items-center'>
        <div className='flex flex-col items-center'>
          <img src={GerbIcon} alt='' className='w-30 h-30' />
          <div className='p-4 pb-6 text-center font-bold'>
            Oʻzbekiston Respublikasi Prezidenti Administratsiyasi huzuridagi Axborot va ommaviy
            kommunikatsiyalar agentligi
          </div>
        </div>
        <h1 className='page-title'>Xavfni tahlil qilish</h1>

        <Button onClick={handleClickOneId} className='w-full' type='primary' size='large'>
          One ID orqali kirish
        </Button>
      </div>
    </div>
  );
};

export default LoginWithOneId;
