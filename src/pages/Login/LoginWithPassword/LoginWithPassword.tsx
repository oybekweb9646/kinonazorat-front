import React, { useState } from 'react';
import { setToken } from '@/service/storage';
import { useMutation } from '@/shared/hooks';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { DefaultError } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GerbIcon from '@/shared/assets/icons/gerb.svg';
import { _AUTHORITY } from '@/service/const/roles';
import { api } from '@/service';

type FieldType = { username: string; password: string };
type DataType = { code: number; message: string; success: boolean; data: { access_token: string } };

const LoginWithPassword: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FieldType>({ username: '', password: '' });
  const [errors, setErrors] = useState<Partial<FieldType>>({});
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

  function validate() {
    const e: Partial<FieldType> = {};
    if (!form.username.trim()) e.username = t('Majburiy maydon');
    if (!form.password.trim()) e.password = t('Majburiy maydon');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    mutate(
      { url: 'auth/login-by-user', data: form },
      {
        onSuccess: (data: DataType) => {
          setToken(data.data.access_token);
          getProfile();
        },
      },
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 50,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12, color: 'white', fontSize: 15,
    paddingLeft: 44, paddingRight: 16, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0f1f17' }}>

      {/* Left decorative panel — CSS controls visibility */}
      <div
        className='lwp-left'
        style={{
          flex: 1, padding: '48px',
          background: 'linear-gradient(145deg, #1B3A2D 0%, #0f2419 60%, #071510 100%)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {[500, 350, 200].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, borderRadius: '50%',
            border: i < 2 ? `1px solid rgba(46,125,82,${i === 0 ? 0.15 : 0.2})` : 'none',
            background: i === 2 ? 'rgba(46,125,82,0.06)' : 'transparent',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }} />
        ))}
        {[
          { top: '15%', left: '20%', w: 6 }, { top: '25%', right: '25%', w: 5 },
          { top: '70%', left: '15%', w: 7 }, { bottom: '20%', right: '20%', w: 8 },
          { top: '45%', left: '8%', w: 4 },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute', top: (d as any).top, left: (d as any).left,
            right: (d as any).right, bottom: (d as any).bottom,
            width: d.w, height: d.w, borderRadius: '50%', background: 'rgba(58,158,104,0.5)',
          }} />
        ))}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', maxWidth: 380,
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

      {/* Right form panel */}
      <div style={{
        width: '100%', maxWidth: 480, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', background: '#111d16',
      }}>

        {/* Mobile-only header — CSS controls visibility */}
        <div className='lwp-mobile-header' style={{
          flexDirection: 'column', alignItems: 'center',
          marginBottom: 36, textAlign: 'center',
        }}>
          <img src={GerbIcon} alt='gerb' style={{ width: 72, height: 72, marginBottom: 12 }} />
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>
            Kinematografiya agentligi
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 36, textAlign: 'center' }}>
            <h1 style={{ color: 'white', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
              {t('Tizimga kirish')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: 14 }}>
              {t('Login va parol bilan kiring')}
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 8 }}>
                {t('Foydalanuvchi nomi')}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center',
                }}>
                  <UserOutlined />
                </span>
                <input
                  type='text'
                  value={form.username}
                  onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setErrors(er => ({ ...er, username: undefined })); }}
                  placeholder='username'
                  autoComplete='username'
                  style={{ ...inputStyle, borderColor: errors.username ? '#ff4d4f' : 'rgba(255,255,255,0.12)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3A9E68'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(58,158,104,0.12)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.username ? '#ff4d4f' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              {errors.username && <p style={{ color: '#ff7875', fontSize: 12, margin: '4px 0 0' }}>{errors.username}</p>}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 8 }}>
                {t('Parol')}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center',
                }}>
                  <LockOutlined />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: undefined })); }}
                  placeholder='••••••••'
                  autoComplete='current-password'
                  style={{ ...inputStyle, paddingRight: 48, borderColor: errors.password ? '#ff4d4f' : 'rgba(255,255,255,0.12)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3A9E68'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(58,158,104,0.12)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.password ? '#ff4d4f' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type='button'
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', padding: 0,
                  }}
                >
                  {showPass ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ff7875', fontSize: 12, margin: '4px 0 0' }}>{errors.password}</p>}
            </div>

            <button
              type='submit'
              disabled={isPending}
              style={{
                width: '100%', height: 50, border: 'none', borderRadius: 12,
                background: isPending ? 'rgba(46,125,82,0.5)' : 'linear-gradient(135deg, #3A9E68 0%, #2E7D52 100%)',
                color: 'white', fontSize: 16, fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 20px rgba(46,125,82,0.3)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isPending) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(46,125,82,0.5)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(46,125,82,0.3)'; }}
            >
              {isPending ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'lwp-spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  {t('Kirish...')}
                </>
              ) : t('Kirish')}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 20px' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{t('yoki')}</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <a
            href='/login'
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 48, borderRadius: 12, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.55)', fontSize: 14, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
          >
            ← {t('One ID orqali kirish')}
          </a>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textAlign: 'center', marginTop: 40 }}>
            © 2025 Kinematografiya agentligi
          </p>
        </div>
      </div>

      <style>{`
        @keyframes lwp-spin { to { transform: rotate(360deg); } }
        .lwp-left        { display: none; flex-direction: column; align-items: center; justify-content: center; }
        .lwp-mobile-header { display: flex; }
        @media (min-width: 1024px) {
          .lwp-left          { display: flex; }
          .lwp-mobile-header { display: none; }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #1a2e20 inset !important;
          -webkit-text-fill-color: white !important;
          caret-color: white;
        }
      `}</style>
    </div>
  );
};

export default LoginWithPassword;