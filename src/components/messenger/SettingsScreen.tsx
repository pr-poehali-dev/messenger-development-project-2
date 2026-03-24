import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { User } from './types';

interface SettingsScreenProps {
  user: User;
  onLogout: () => void;
}

type Modal = 'password' | 'sessions' | 'export' | 'delete' | null;

export default function SettingsScreen({ user, onLogout }: SettingsScreenProps) {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    notifications: true,
    sounds: true,
    readReceipts: true,
    onlineStatus: true,
    twoFactor: false,
    darkMode: true,
  });
  const [modal, setModal] = useState<Modal>(null);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const toggle = (key: string) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleChangePassword = () => {
    if (!pwForm.current) { setPwError('Введите текущий пароль'); return; }
    if (pwForm.next.length < 6) { setPwError('Новый пароль минимум 6 символов'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Пароли не совпадают'); return; }
    setPwError('');
    setPwSuccess(true);
    setTimeout(() => { setPwSuccess(false); setModal(null); setPwForm({ current: '', next: '', confirm: '' }); }, 1500);
  };

  const handleExport = () => {
    const data = {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      exportDate: new Date().toISOString(),
      note: 'Экспорт данных Pulse',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse_data_${user.username}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setModal(null);
  };

  const handleDelete = () => {
    if (deleteConfirm !== 'УДАЛИТЬ') return;
    onLogout();
  };

  const mockSessions = [
    { id: '1', device: 'iPhone 15 Pro', location: 'Москва, Россия', time: 'Сейчас', current: true, icon: 'Smartphone' },
    { id: '2', device: 'Chrome / Windows', location: 'Санкт-Петербург', time: '2 часа назад', current: false, icon: 'Monitor' },
    { id: '3', device: 'Safari / macOS', location: 'Москва, Россия', time: 'Вчера', current: false, icon: 'Laptop' },
  ];

  const sections: { title: string; items: { icon: string; label: string; desc?: string; type: 'toggle' | 'link' | 'info'; key?: string; action?: () => void; danger?: boolean }[] }[] = [
    {
      title: 'Уведомления',
      items: [
        { icon: 'Bell', label: 'Уведомления', desc: 'Push-уведомления', type: 'toggle', key: 'notifications' },
        { icon: 'Volume2', label: 'Звуки', desc: 'Звуки сообщений', type: 'toggle', key: 'sounds' },
      ],
    },
    {
      title: 'Конфиденциальность',
      items: [
        { icon: 'CheckCheck', label: 'Прочитано', desc: 'Показывать статус прочтения', type: 'toggle', key: 'readReceipts' },
        { icon: 'Eye', label: 'Статус онлайн', desc: 'Показывать когда вы в сети', type: 'toggle', key: 'onlineStatus' },
        { icon: 'Shield', label: 'Двухфакторная', desc: 'Дополнительная защита', type: 'toggle', key: 'twoFactor' },
      ],
    },
    {
      title: 'Оформление',
      items: [
        { icon: 'Moon', label: 'Тёмная тема', desc: 'Тёмный режим интерфейса', type: 'toggle', key: 'darkMode' },
      ],
    },
    {
      title: 'Аккаунт',
      items: [
        { icon: 'Lock', label: 'Сменить пароль', type: 'link', action: () => setModal('password') },
        { icon: 'Smartphone', label: 'Активные сессии', type: 'link', action: () => setModal('sessions') },
        { icon: 'Download', label: 'Экспорт данных', type: 'link', action: () => setModal('export') },
        { icon: 'Trash2', label: 'Удалить аккаунт', type: 'link', action: () => setModal('delete'), danger: true },
      ],
    },
    {
      title: 'О приложении',
      items: [
        { icon: 'Zap', label: 'Версия', desc: 'Pulse 1.0.0', type: 'info' },
        { icon: 'Heart', label: 'Сделано с любовью ❤️', type: 'info' },
      ],
    },
  ];

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-3">
          <h1 className="text-2xl font-black">Настройки</h1>
          <p className="text-muted-foreground text-sm mt-0.5">@{user.username}</p>
        </div>

        <div className="px-4 space-y-4 pb-8">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</p>
              <div className="glass rounded-2xl overflow-hidden">
                {section.items.map((item, j) => (
                  <div
                    key={item.label}
                    onClick={item.action}
                    className={`flex items-center gap-3 px-4 py-3.5 ${j < section.items.length - 1 ? 'border-b border-border/50' : ''} ${item.type === 'link' ? 'cursor-pointer transition-colors' : ''} ${item.danger ? 'hover:bg-red-400/10' : item.type === 'link' ? 'hover:bg-card/60' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.danger ? 'bg-red-400/15' : 'bg-primary/15'}`}>
                      <Icon name={item.icon} fallback="Settings" size={16} className={item.danger ? 'text-red-400' : 'text-primary'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${item.danger ? 'text-red-400' : ''}`}>{item.label}</p>
                      {item.desc && <p className="text-xs text-muted-foreground">{item.desc}</p>}
                    </div>
                    {item.type === 'toggle' && item.key && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(item.key!); }}
                        className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${settings[item.key!] ? 'gradient-bg' : 'bg-border'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${settings[item.key!] ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    )}
                    {item.type === 'link' && (
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal backdrop */}
      {modal && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-md glass-strong rounded-t-3xl p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* — Смена пароля — */}
            {modal === 'password' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Сменить пароль</h2>
                  <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={20} />
                  </button>
                </div>
                {pwSuccess ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="font-semibold text-green-400">Пароль изменён!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Текущий пароль</label>
                      <input
                        type="password"
                        className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary/40 transition-all"
                        placeholder="••••••••"
                        value={pwForm.current}
                        onChange={e => { setPwForm(f => ({ ...f, current: e.target.value })); setPwError(''); }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Новый пароль</label>
                      <input
                        type="password"
                        className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary/40 transition-all"
                        placeholder="Минимум 6 символов"
                        value={pwForm.next}
                        onChange={e => { setPwForm(f => ({ ...f, next: e.target.value })); setPwError(''); }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Повторите новый пароль</label>
                      <input
                        type="password"
                        className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-primary/40 transition-all"
                        placeholder="••••••••"
                        value={pwForm.confirm}
                        onChange={e => { setPwForm(f => ({ ...f, confirm: e.target.value })); setPwError(''); }}
                      />
                    </div>
                    {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
                    <button
                      onClick={handleChangePassword}
                      className="w-full gradient-bg text-white rounded-2xl py-3.5 font-semibold text-sm mt-2 hover:opacity-90 transition-all"
                    >
                      Сохранить пароль
                    </button>
                  </div>
                )}
              </>
            )}

            {/* — Активные сессии — */}
            {modal === 'sessions' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Активные сессии</h2>
                  <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={20} />
                  </button>
                </div>
                <div className="space-y-2 mb-4">
                  {mockSessions.map(s => (
                    <div key={s.id} className={`glass rounded-2xl px-4 py-3.5 flex items-center gap-3 ${s.current ? 'border border-primary/30' : ''}`}>
                      <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name={s.icon} fallback="Smartphone" size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{s.device}</p>
                          {s.current && <span className="text-[10px] gradient-bg text-white px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">Текущая</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && (
                        <button className="text-red-400 hover:opacity-80 transition-opacity flex-shrink-0">
                          <Icon name="LogOut" size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full glass rounded-2xl py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
                  Завершить все другие сессии
                </button>
              </>
            )}

            {/* — Экспорт данных — */}
            {modal === 'export' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Экспорт данных</h2>
                  <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={20} />
                  </button>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { icon: 'User', label: 'Данные профиля', desc: 'Имя, юзернейм, bio' },
                    { icon: 'MessageCircle', label: 'История чатов', desc: 'Все сообщения' },
                    { icon: 'Users', label: 'Контакты', desc: 'Список контактов' },
                  ].map(item => (
                    <div key={item.label} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name={item.icon} fallback="File" size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleExport}
                  className="w-full gradient-bg text-white rounded-2xl py-3.5 font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="Download" size={16} className="text-white" />
                  Скачать данные (JSON)
                </button>
              </>
            )}

            {/* — Удалить аккаунт — */}
            {modal === 'delete' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-red-400">Удалить аккаунт</h2>
                  <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={20} />
                  </button>
                </div>
                <div className="bg-red-400/10 border border-red-400/20 rounded-2xl px-4 py-3 mb-5">
                  <p className="text-sm text-red-300 leading-relaxed">Это действие необратимо. Все ваши данные, чаты и контакты будут удалены навсегда.</p>
                </div>
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Введите <span className="text-red-400 font-mono font-bold">УДАЛИТЬ</span> для подтверждения</label>
                  <input
                    className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-400/40 transition-all"
                    placeholder="УДАЛИТЬ"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirm !== 'УДАЛИТЬ'}
                  className="w-full bg-red-500 text-white rounded-2xl py-3.5 font-semibold text-sm hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Удалить аккаунт навсегда
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
