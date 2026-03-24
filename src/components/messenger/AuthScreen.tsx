import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

type AuthStep = 'login' | 'register' | 'username';
type AuthMethod = 'email' | 'phone';

interface StoredAccount {
  username: string;
  displayName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthScreenProps {
  onAuth: (username: string, displayName: string) => void;
}

const ACCOUNTS_KEY = 'pulse_accounts';

function getAccounts(): StoredAccount[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); } catch { return []; }
}

function saveAccount(acc: StoredAccount) {
  const accounts = getAccounts();
  accounts.push(acc);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  let d = digits;
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  if (d.length <= 1) return '+' + d;
  if (d.length <= 4) return `+${d[0]} (${d.slice(1)}`;
  if (d.length <= 7) return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4)}`;
  if (d.length <= 9) return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
}

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length === 11;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>('login');
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [form, setForm] = useState({ email: '', phone: '', password: '', username: '', name: '' });
  const [error, setError] = useState('');

  const handleLogin = () => {
    const accounts = getAccounts();

    if (method === 'phone') {
      if (!isValidPhone(form.phone)) { setError('Введите корректный номер телефона'); return; }
      if (form.password.length < 6) { setError('Пароль минимум 6 символов'); return; }
      const digits = form.phone.replace(/\D/g, '');
      const found = accounts.find(a => a.phone.replace(/\D/g, '') === digits && a.password === form.password);
      if (!found) { setError('Неверный номер или пароль'); return; }
      onAuth(found.username, found.displayName);
    } else {
      if (!isValidEmail(form.email)) { setError('Введите корректный email'); return; }
      if (form.password.length < 6) { setError('Пароль минимум 6 символов'); return; }
      const found = accounts.find(a => a.email.toLowerCase() === form.email.toLowerCase() && a.password === form.password);
      if (!found) { setError('Неверный email или пароль'); return; }
      onAuth(found.username, found.displayName);
    }
  };

  const handleRegisterNext = () => {
    if (!form.name.trim()) { setError('Введите имя'); return; }
    if (method === 'phone') {
      if (!isValidPhone(form.phone)) { setError('Введите корректный номер (+7 XXX XXX-XX-XX)'); return; }
    } else {
      if (!isValidEmail(form.email)) { setError('Введите корректный email'); return; }
    }
    if (form.password.length < 6) { setError('Пароль минимум 6 символов'); return; }

    const accounts = getAccounts();
    if (method === 'phone') {
      const digits = form.phone.replace(/\D/g, '');
      if (accounts.find(a => a.phone.replace(/\D/g, '') === digits)) {
        setError('Аккаунт с таким номером уже существует'); return;
      }
    } else {
      if (accounts.find(a => a.email.toLowerCase() === form.email.toLowerCase())) {
        setError('Аккаунт с таким email уже существует'); return;
      }
    }

    setError('');
    setStep('username');
  };

  const handleFinish = () => {
    if (!form.username || form.username.length < 3) { setError('Минимум 3 символа'); return; }
    if (!/^[a-z0-9_]+$/.test(form.username)) { setError('Только латиница, цифры и _'); return; }

    const accounts = getAccounts();
    if (accounts.find(a => a.username === form.username)) {
      setError('Этот юзернейм уже занят'); return;
    }

    const newAccount: StoredAccount = {
      username: form.username,
      displayName: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    };
    saveAccount(newAccount);
    setError('');
    onAuth(form.username, form.name);
  };

  const updatePhone = (raw: string) => {
    const formatted = formatPhone(raw);
    setForm(f => ({ ...f, phone: formatted }));
    setError('');
  };

  const update = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'hsl(262,83%,68%)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'hsl(186,100%,50%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(320,90%,65%)' }} />

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
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

          {/* Step: login / register */}
          {(step === 'login' || step === 'register') && (
            <div className="animate-fade-in">
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

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => { setMethod('phone'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border transition-all ${method === 'phone' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                >
                  <Icon name="Phone" size={13} /> Телефон
                </button>
                <button
                  onClick={() => { setMethod('email'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border transition-all ${method === 'email' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                >
                  <Icon name="Mail" size={13} /> Email
                </button>
              </div>

              <div className="space-y-3">
                {step === 'register' && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Имя</label>
                    <input
                      className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary/40 transition-all"
                      placeholder="Как вас зовут?"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                    {method === 'phone' ? 'Номер телефона' : 'Email'}
                  </label>
                  {method === 'phone' ? (
                    <input
                      className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary/40 transition-all"
                      placeholder="+7 (999) 000-00-00"
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={e => updatePhone(e.target.value)}
                    />
                  ) : (
                    <input
                      className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary/40 transition-all"
                      placeholder="example@email.com"
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Пароль</label>
                  <input
                    className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary/40 transition-all"
                    placeholder={step === 'register' ? 'Минимум 6 символов' : '••••••••'}
                    type="password"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                    <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-xs">{error}</p>
                  </div>
                )}

                <button
                  onClick={step === 'login' ? handleLogin : handleRegisterNext}
                  className="w-full gradient-bg text-white rounded-2xl py-3.5 font-semibold text-sm transition-all hover:opacity-90 active:scale-95 mt-2 neon-glow"
                >
                  {step === 'login' ? 'Войти' : 'Далее →'}
                </button>

                {step === 'login' && (
                  <p className="text-center text-xs text-muted-foreground">
                    Нет аккаунта?{' '}
                    <button onClick={() => { setStep('register'); setError(''); }} className="text-primary hover:opacity-80">
                      Зарегистрироваться
                    </button>
                  </p>
                )}
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
