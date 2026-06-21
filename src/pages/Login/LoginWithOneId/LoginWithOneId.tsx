import React from 'react';
import GerbIcon from '@/shared/assets/icons/gerb.svg';
import OneIdIcon from '@/shared/assets/icons/one-id.svg';
import QueryString from 'qs';
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

      {/* Left decorative panel — hidden on mobile, flex on desktop via CSS */}
      <div
        className='l1-left'
        style={{
          flex: 1,
          padding: '48px',
          background: 'linear-gradient(145deg, #1B3A2D 0%, #0f2419 60%, #071510 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {[500, 350, 200].map((size, i) => (
          <div key={i} style={{
            position: 'absolute', width: size, height: size, borderRadius: '50%',
            border: i < 2 ? `1px solid rgba(46,125,82,${i === 0 ? 0.12 : 0.18})` : 'none',
            background: i === 2 ? 'rgba(46,125,82,0.05)' : 'transparent',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }} />
        ))}
        {[
          { top: '14%', left: '18%', w: 7 }, { top: '22%', right: '22%', w: 5 },
          { top: '68%', left: '12%', w: 6 }, { bottom: '18%', right: '18%', w: 8 },
          { top: '44%', left: '7%', w: 4 },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute', top: (d as any).top, left: (d as any).left,
            right: (d as any).right, bottom: (d as any).bottom,
            width: d.w, height: d.w, borderRadius: '50%', background: 'rgba(58,158,104,0.45)',
          }} />
        ))}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          maxWidth: 380,
        }}>
          <img src={GerbIcon} alt='gerb' style={{
            width: 112, height: 112, marginBottom: 28,
            filter: 'drop-shadow(0 4px 28px rgba(46,125,82,0.45))',
          }} />
          <h2 style={{ color: 'white', fontSize: 21, fontWeight: 700, lineHeight: 1.45, margin: '0 0 18px' }}>
            {t('Oʻzbekiston Respublikasi Madaniyat vazirligi huzuridagi Kinematografiya agentligi')}
          </h2>
          <div style={{ width: 52, height: 3, background: 'linear-gradient(90deg, #2E7D52, #3A9E68)', borderRadius: 2, marginBottom: 20 }} />
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: 0 }}>
            {t('Xavfni tahlil qilish tizimi')}
          </p>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{
        width: '100%', maxWidth: 480, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
        background: '#111d16',
      }}>

        {/* Mobile-only gerb header — hidden on desktop via CSS */}
        <div className='l1-mobile-header' style={{
          flexDirection: 'column', alignItems: 'center',
          marginBottom: 36, textAlign: 'center',
        }}>
          <img src={GerbIcon} alt='gerb' style={{ width: 72, height: 72, marginBottom: 14 }} />
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0, maxWidth: 260 }}>
            {t('Oʻzbekiston Respublikasi Madaniyat vazirligi huzuridagi Kinematografiya agentligi')}
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 style={{ color: 'white', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
              {t('Tizimga kirish')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.38)', margin: 0, fontSize: 14 }}>
              {t('Xavfni tahlil qilish tizimi')}
            </p>
          </div>

          <button
            onClick={() => { window.location.href = oneIdUrl; }}
            style={{
              width: '100%', padding: '15px 24px', borderRadius: 12,
              border: '1px solid rgba(46,125,82,0.45)',
              background: 'linear-gradient(135deg, #2E7D52 0%, #1a3d28 100%)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 24px rgba(46,125,82,0.22)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(46,125,82,0.42)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(46,125,82,0.22)';
            }}
          >
            <img src={OneIdIcon} alt='OneID' style={{ width: 28, height: 28 }} />
            <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>
              {t('One ID orqali kirish')}
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 20px' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>{t('yoki')}</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <a
            href='/login-with-password'
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 50, borderRadius: 12, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.55)', fontSize: 14,
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
            }}
          >
            {t('Login va parol bilan kirish')}
          </a>

          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12, textAlign: 'center', marginTop: 44 }}>
            © 2025 Kinematografiya agentligi
          </p>
        </div>
      </div>

      <style>{`
        .l1-left       { display: none; flex-direction: column; align-items: center; justify-content: center; }
        .l1-mobile-header { display: flex; }
        @media (min-width: 1024px) {
          .l1-left          { display: flex; }
          .l1-mobile-header { display: none; }
        }
      `}</style>
    </div>
  );
};

export default LoginWithOneId;