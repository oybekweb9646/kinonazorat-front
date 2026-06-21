import React from 'react';
import GerbIcon from '@/shared/assets/icons/gerb.svg';
import OneIdIcon from '@/shared/assets/icons/one-id.svg';
import QueryString from 'qs';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

const generateOneIdUrl = () => {
  const oneIdState = Date.now() + Math.random();
  sessionStorage.setItem('oneIdState', String(oneIdState));
  const query = QueryString.stringify({
    client_id: 'uzbkinonazorat_uz',
    response_type: 'one_code',
    scope: 'hisobim_uz',
    redirect_uri: `https://uzbkinonazorat.uz/auth`,
    state: oneIdState,
  });
  return `https://sso.egov.uz/sso/oauth/Authorization.do?${query}`;
};

const LoginWithOneId: React.FC = () => {
  const { t } = useTranslation();
  const oneIdUrl = generateOneIdUrl();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0f1f17' }}>
      {/* Left panel — decorative */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          background: 'linear-gradient(145deg, #1B3A2D 0%, #0f2419 60%, #071510 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className='hidden lg:flex'
      >
        {/* Background circles */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', border: '1px solid rgba(46,125,82,0.15)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350,
          borderRadius: '50%', border: '1px solid rgba(46,125,82,0.2)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />
        <div style={{
          position: 'absolute', width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(46,125,82,0.06)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />
        {/* Floating dots */}
        {[
          { top: '15%', left: '20%', size: 6 },
          { top: '25%', right: '25%', size: 4 },
          { top: '70%', left: '15%', size: 5 },
          { bottom: '20%', right: '20%', size: 7 },
          { top: '45%', left: '8%', size: 3 },
        ].map((dot, i) => (
          <div key={i} style={{
            position: 'absolute', ...dot,
            width: dot.size, height: dot.size,
            borderRadius: '50%', background: 'rgba(58,158,104,0.5)',
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <img src={GerbIcon} alt='gerb' style={{ width: 110, height: 110, marginBottom: 32, filter: 'drop-shadow(0 4px 24px rgba(46,125,82,0.4))' }} />
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, lineHeight: 1.4, margin: 0, marginBottom: 16, maxWidth: 360 }}>
            {t('Oʻzbekiston Respublikasi Madaniyat vazirligi huzuridagi Kinematografiya agentligi')}
          </h2>
          <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #2E7D52, #3A9E68)', borderRadius: 2, margin: '0 auto 24px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
            {t('Xavfni tahlil qilish tizimi')}
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        width: '100%', maxWidth: 480,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
        background: '#111d16',
      }}>
        {/* Mobile gerb */}
        <div className='flex lg:hidden flex-col items-center mb-8'>
          <img src={GerbIcon} alt='gerb' style={{ width: 72, height: 72, marginBottom: 12 }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', margin: 0 }}>
            {t('Oʻzbekiston Respublikasi Madaniyat vazirligi huzuridagi Kinematografiya agentligi')}
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ color: 'white', fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 8 }}>
              {t('Tizimga kirish')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: 14 }}>
              {t('Xavfni tahlil qilish tizimi')}
            </p>
          </div>

          {/* OneID button */}
          <button
            onClick={() => { window.location.href = oneIdUrl; }}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 12,
              border: '1px solid rgba(46,125,82,0.4)',
              background: 'linear-gradient(135deg, #2E7D52 0%, #1B3A2D 100%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              transition: 'all 0.2s',
              boxShadow: '0 4px 24px rgba(46,125,82,0.2)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(46,125,82,0.4)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(46,125,82,0.2)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <img src={OneIdIcon} alt='OneID' style={{ width: 28, height: 28 }} />
            <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>
              {t('One ID orqali kirish')}
            </span>
          </button>

          <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{t('yoki')}</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <Button
            href='/login-with-password'
            style={{
              marginTop: 20,
              width: '100%',
              height: 48,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 14,
            }}
          >
            {t("Login va parol bilan kirish")}
          </Button>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textAlign: 'center', marginTop: 40 }}>
            © 2025 Kinematografiya agentligi
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginWithOneId;