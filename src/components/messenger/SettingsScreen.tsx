import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SettingItem {
  icon: string;
  label: string;
  desc?: string;
  type: 'toggle' | 'link' | 'info';
  value?: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    notifications: true,
    sounds: true,
    readReceipts: true,
    onlineStatus: true,
    twoFactor: false,
    darkMode: true,
  });

  const toggle = (key: string) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const sections: { title: string; items: (SettingItem & { key?: string })[] }[] = [
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
        { icon: 'Lock', label: 'Сменить пароль', type: 'link' },
        { icon: 'Smartphone', label: 'Активные сессии', type: 'link' },
        { icon: 'Download', label: 'Экспорт данных', type: 'link' },
        { icon: 'Trash2', label: 'Удалить аккаунт', type: 'link' },
      ],
    },
    {
      title: 'О приложении',
      items: [
        { icon: 'Zap', label: 'Версия', desc: 'Pulse 1.0.0', type: 'info' },
        { icon: 'FileText', label: 'Условия использования', type: 'link' },
        { icon: 'Heart', label: 'Сделано с любовью ❤️', type: 'info' },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-black">Настройки</h1>
      </div>

      <div className="px-4 space-y-4 pb-8">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</p>
            <div className="glass rounded-2xl overflow-hidden">
              {section.items.map((item, j) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3.5 ${j < section.items.length - 1 ? 'border-b border-border/50' : ''} ${item.type === 'link' ? 'hover:bg-card/60 cursor-pointer active:bg-card transition-colors' : ''} ${item.label === 'Удалить аккаунт' ? 'hover:bg-red-400/10' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.label === 'Удалить аккаунт' ? 'bg-red-400/15' : 'bg-primary/15'}`}>
                    <Icon name={item.icon} fallback="Settings" size={16} className={item.label === 'Удалить аккаунт' ? 'text-red-400' : 'text-primary'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.label === 'Удалить аккаунт' ? 'text-red-400' : ''}`}>{item.label}</p>
                    {item.desc && <p className="text-xs text-muted-foreground">{item.desc}</p>}
                  </div>
                  {item.type === 'toggle' && item.key && (
                    <button
                      onClick={() => toggle(item.key!)}
                      className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${settings[item.key] ? 'gradient-bg' : 'bg-border'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${settings[item.key] ? 'left-[22px]' : 'left-0.5'}`} />
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
  );
}