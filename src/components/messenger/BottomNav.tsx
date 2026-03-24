import React from 'react';
import { Screen } from './types';
import Icon from '@/components/ui/icon';

interface NavItem {
  id: Screen;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'search', icon: 'Search', label: 'Поиск' },
  { id: 'notifications', icon: 'Bell', label: 'Уведом.' },
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];

interface BottomNavProps {
  active: Screen;
  onChange: (screen: Screen) => void;
  unreadChats: number;
  unreadNotifs: number;
}

export default function BottomNav({ active, onChange, unreadChats, unreadNotifs }: BottomNavProps) {
  const badges: Record<string, number> = {
    chats: unreadChats,
    notifications: unreadNotifs,
  };

  return (
    <div className="glass border-t border-border flex-shrink-0">
      <div className="flex items-center">
        {navItems.map(item => {
          const isActive = active === item.id;
          const badge = badges[item.id] || 0;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 relative transition-all active:scale-90"
            >
              <div className="relative">
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'gradient-bg' : ''}`}>
                  <Icon
                    name={item.icon}
                    size={20}
                    className={isActive ? 'text-white' : 'text-muted-foreground'}
                  />
                </div>
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 gradient-bg rounded-full flex items-center justify-center text-[10px] font-bold text-white px-0.5">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-all ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
