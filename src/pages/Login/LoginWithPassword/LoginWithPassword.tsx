import React, { useState } from 'react';
import { setToken } from '@/service/storage';
import { useMutation } from '@/shared/hooks';
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { DefaultError } from '@tanstack/react-query';
import { ConfigProvider, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GerbIcon from '@/shared/assets/icons/gerb.svg';
import { _AUTHORITY } from '@/service/const/roles';
import { api } from '@/service';

type FieldType = { username: string; password: string };
type DataType = { code: number; message: string; success: boolean; data: { access_token: string } };

const LoginWithPassword: React.FC = () => {
  const { t } = useTranslation();
  const [showPass, setShowPass] = useState(false);
  const { mutate, isPending } = useMutation<DataType, DefaultError>({
    mutationKey: 'login',
    onError: () => {},
  });
  const navigate = useNavigate();

  async function getProfile() {
    try {
      const { data } = await api.get('/user/detail');
      navigate(data.data.user.role === _AUTHORITY ? '/normative-documents' : '/');
    } catch (_) {}
  }

  function onSubmit(values: FieldType) {
    mutate(
      { url: 'auth/login-by-user', data: values },
      { onSuccess: (data: DataType) => { setToken(data.data.access_token); getProfile(); } },
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: 'rgba(255,255,255,0.06)',
          colorBorder: 'rgba(255,255,255,0.12)',
          colorText: '#ffffff',
          colorTextPlaceholder: 'rgba(255,255,255,0.28)',
          colorPrimary: '#3A9E68',
          borderRadius: 12,
          controlHeight: 50,
          fontSize: 15,
        },
        components: {
          Input: {
            activeBorderColor: '#3A9E68',
            hoverBorderColor: 'rgba(58,158,104,0.5)',
            activeShadow: '0 0 0 3px rgba(58,158,104,0.12)',
            colorBgContainer: 'rgba(255,255,255,0.06)',
            colorText: '#ffffff',
            colorTextPlaceholder: 'rgba(255,255,255,0.28)',
            colorBorder: 'rgba(255,255,255,0.12)',
          },
          Form: {
            labelColor: 'rgba(255,255,255,0.55)',
            labelFontSize: 13,
          },
        },
      }}
    >
      <div style={{ minHeight: '100vh', display: 'flex', background: '#0c1a10', position: 'relative', overflow: 'hidden' }}>

        {/* Animated background blobs */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,125,82,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-8%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(27,58,45,0.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(46,125,82,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,82,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        {/* Left — info panel */}
        <div style={{
          flex: 1, display: 'none', flexDirection: 'column',
          justifyContent: 'space-between', padding: '56px 64px',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          position: 'relative', zIndex: 1,
        }} className='lg:flex! flex-col'>

          {/* Logo top */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={GerbIcon} alt='gerb' style={{ width: 44, height: 44 }} />
            <div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
                Kinematografiya agentligi
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
                O'zbekiston Respublikasi
              </div>
            </div>
          </div>

          {/* Center content */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(46,125,82,0.15)', border: '1px solid rgba(46,125,82,0.25)',
              borderRadius: 20, padding: '6px 14px', marginBottom: 28,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3A9E68' }} />
              <span style={{ color: '#3A9E68', fontSize: 12, fontWeight: 600 }}>
                Xavfni tahlil qilish tizimi
              </span>
            </div>

            <h1 style={{ color: 'white', fontSize: 38, fontWeight: 800, lineHeight: 1.25, margin: 0, marginBottom: 20, maxWidth: 440 }}>
              {t('Oʻzbekiston Respublikasi Madaniyat vazirligi huzuridagi Kinematografiya agentligi')}
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, margin: 0, maxWidth: 380, lineHeight: 1.7 }}>
              {t('Tashkilotlar faoliyatini baholash va monitoring qilish uchun avtomatlashtirilgan tizim')}
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { label: t('Tashkilotlar'), value: '100+' },
              { label: t('Baholashlar'), value: '500+' },
              { label: t('Foydalanuvchilar'), value: '50+' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ color: '#3A9E68', fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form panel */}
        <div style={{
          width: '100%', maxWidth: 500, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 48px',
          position: 'relative', zIndex: 1,
          background: 'rgba(10,20,13,0.7)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ width: '100%', maxWidth: 380 }}>

            {/* Mobile header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }} className='block lg:hidden'>
              <img src={GerbIcon} alt='gerb' style={{ width: 64, height: 64, marginBottom: 12 }} />
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                Kinematografiya agentligi
              </div>
            </div>

            {/* Form header */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: 'white', fontSize: 26, fontWeight: 700, margin: 0, marginBottom: 6 }}>
                {t('Tizimga kirish')}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', margin: 0, fontSize: 14 }}>
                {t('Hisobingizga kirish uchun ma\'lumotlarni kiriting')}
              </p>
            </div>

            <Form layout='vertical' onFinish={onSubmit}>
              <Form.Item<FieldType>
                name='username'
                label={t('Foydalanuvchi nomi')}
                rules={[{ required: true, message: t('Majburiy maydon') }]}
                style={{ marginBottom: 18 }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.3)', marginRight: 4 }} />}
                  placeholder='username'
                  size='large'
                  autoComplete='username'
                />
              </Form.Item>

              <Form.Item<FieldType>
                name='password'
                label={t('Parol')}
                rules={[{ required: true, message: t('Majburiy maydon') }]}
                style={{ marginBottom: 28 }}
              >
                <Input
                  type={showPass ? 'text' : 'password'}
                  prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.3)', marginRight: 4 }} />}
                  suffix={
                    <span
                      onClick={() => setShowPass(p => !p)}
                      style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showPass ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </span>
                  }
                  placeholder='••••••••'
                  size='large'
                  autoComplete='current-password'
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 16 }}>
                <button
                  type='submit'
                  disabled={isPending}
                  style={{
                    width: '100%', height: 52, border: 'none', borderRadius: 12,
                    background: isPending
                      ? 'rgba(46,125,82,0.4)'
                      : 'linear-gradient(135deg, #3A9E68 0%, #1B5E35 100%)',
                    color: 'white', fontSize: 15, fontWeight: 700,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    letterSpacing: 0.3,
                    boxShadow: isPending ? 'none' : '0 4px 24px rgba(58,158,104,0.35)',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    if (!isPending) {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(58,158,104,0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(58,158,104,0.35)';
                  }}
                >
                  {isPending ? (
                    <>
                      <span style={{
                        width: 18, height: 18,
                        border: '2px solid rgba(255,255,255,0.25)',
                        borderTopColor: 'white', borderRadius: '50%',
                        animation: 'lwp-spin 0.7s linear infinite',
                        display: 'inline-block',
                      }} />
                      {t('Kirish...')}
                    </>
                  ) : (
                    t('Kirish')
                  )}
                </button>
              </Form.Item>
            </Form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 20px' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>{t('yoki')}</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <a
              href='/login'
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                height: 48, borderRadius: 12, textDecoration: 'none',
                border: '1px solid rgba(58,158,104,0.3)',
                background: 'rgba(58,158,104,0.07)',
                color: 'rgba(58,158,104,0.9)', fontSize: 14, fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(58,158,104,0.14)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(58,158,104,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(58,158,104,0.07)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(58,158,104,0.3)';
              }}
            >
              {t('One ID orqali kirish')}
            </a>

            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, textAlign: 'center', marginTop: 40 }}>
              © 2025 Kinematografiya agentligi
            </p>
          </div>
        </div>

        <style>{`
          @keyframes lwp-spin { to { transform: rotate(360deg); } }
          .lg\\:flex\\! { display: flex !important; }
          .lg\\:hidden { display: none; }
          @media (min-width: 1024px) {
            .lg\\:flex\\! { display: flex !important; }
            .lg\\:hidden { display: none !important; }
            .block.lg\\:hidden { display: none !important; }
          }
          @media (max-width: 1023px) {
            .lg\\:flex\\! { display: none !important; }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default LoginWithPassword;