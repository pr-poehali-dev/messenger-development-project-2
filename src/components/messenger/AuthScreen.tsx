import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

type AuthStep = 'login' | 'register' | 'username';
type AuthMethod = 'email' | 'phone';

interface AuthScreenProps {
  onAuth: (username: string, displayName: string) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>('login');
  const [method, setMethod] = useState<AuthMethod>('email');
  const [form, setForm] = useState({ email: '', phone: '', password: '', username: '', name: '' });
  const [error, setError] = useState('');

  const handleLogin = () => {
    const val = method === 'email' ? form.email : form.phone;
    if (!val || !form.password) { setError('Заполните все поля'); return; }
    onAuth('user_' + Math.floor(Math.random() * 9999), form.name || 'Пользователь');
  };

  const handleRegisterNext = () => {
    const val = method === 'email' ? form.email : form.phone;
    if (!val || !form.password || !form.name) { setError('Заполните все поля'); return; }
    setError('');
    setStep('username');
  };

  const handleFinish = () => {
    if (!form.username || form.username.length < 3) { setError('Минимум 3 символа'); return; }
    if (!/^[a-z0-9_]+$/.test(form.username)) { setError('Только латиница, цифры и _'); return; }
    setError('');
    onAuth(form.username, form.name);
  };

  const update = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'hsl(262,83%,68%)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'hsl(186,100%,50%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(320,90%,65%)' }} />

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 neon-glow" style={{ background: 'linear-gradient(135deg, hsl(262,83%,68%), hsl(186,100%,50%))' }}>
            <span className="text-4xl">⚡</span>
          </div>
          <h1 className="text-4xl font-black gradient-text">Pulse</h1>
          <p className="text-muted-foreground mt-1 text-sm">Мессенджер нового поколения</p>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          {/* Step: username */}
          {step === 'username' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-1">Придумайте юзернейм</h2>
              <p className="text-muted-foreground text-sm mb-6">По нему вас смогут найти друзья</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Юзернейм</label>
                  <div className="flex items-center glass rounded-2xl px-4 py-3 gap-2">
                    <span className="text-muted-foreground">@</span>
                    <input
                      className="bg-transparent flex-1 outline-none text-sm placeholder:text-muted-foreground/50"
                      placeholder="только_латиница_и_цифры"
                      value={form.username}
                      onChange={e => update('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 ml-1">Минимум 3 символа, только a-z, 0-9, _</p>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                  onClick={handleFinish}
                  className="w-full gradient-bg text-white rounded-2xl py-3.5 font-semibold text-sm transition-all hover:opacity-90 active:scale-95 neon-glow"
                >
                  Готово — войти в Pulse ⚡
                </button>
              </div>
            </div>
          )}

          {/* Step: login or register */}
          {(step === 'login' || step === 'register') && (
            <div className="animate-fade-in">
              {/* Tab switcher */}
              <div className="flex glass rounded-2xl p-1 mb-6">
                <button
                  onClick={() => { setStep('login'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${step === 'login' ? 'gradient-bg text-white' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Войти
                </button>
                <button
                  onClick={() => { setStep('register'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${step === 'register' ? 'gradient-bg text-white' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Регистрация
                </button>
              </div>

              {/* Method switcher */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border transition-all ${method === 'email' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                >
                  <Icon name="Mail" size={13} /> Email
                </button>
                <button
                  onClick={() => setMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border transition-all ${method === 'phone' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                >
                  <Icon name="Phone" size={13} /> Телефон
                </button>
              </div>

              <div className="space-y-3">
                {step === 'register' && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Имя</label>
                    <input
                      className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 border border-transparent transition-all"
                      placeholder="Как вас зовут?"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">{method === 'email' ? 'Email' : 'Телефон'}</label>
                  {method === 'email' ? (
                    <input
                      className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 border border-transparent transition-all"
                      placeholder="example@email.com"
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                    />
                  ) : (
                    <input
                      className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 border border-transparent transition-all"
                      placeholder="+7 (999) 000-00-00"
                      type="tel"
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Пароль</label>
                  <input
                    className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 border border-transparent transition-all"
                    placeholder="••••••••"
                    type="password"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                  />
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                  onClick={step === 'login' ? handleLogin : handleRegisterNext}
                  className="w-full gradient-bg text-white rounded-2xl py-3.5 font-semibold text-sm transition-all hover:opacity-90 active:scale-95 mt-2 neon-glow"
                >
                  {step === 'login' ? 'Войти' : 'Далее →'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground/50 text-xs mt-6">
          Нажимая кнопку, вы принимаете условия использования
        </p>
      </div>
    </div>
  );
}
