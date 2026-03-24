import React from 'react';
import { Notification } from './types';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface NotificationsScreenProps {
  notifications: Notification[];
}

export default function NotificationsScreen({ notifications }: NotificationsScreenProps) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Уведомления</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {unread > 0 ? `${unread} новых` : 'Всё прочитано'}
          </p>
        </div>
        {unread > 0 && (
          <button className="text-xs font-medium text-primary hover:opacity-80 transition-opacity">
            Прочитать все
          </button>
        )}
      </div>

      <div className="px-2 space-y-1">
        {notifications.map((notif, i) => (
          <div
            key={notif.id}
            className={`flex items-start gap-3 px-3 py-3 rounded-2xl transition-all animate-fade-in ${notif.read ? 'opacity-60' : 'bg-primary/5 border border-primary/10'}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {notif.from ? (
              <Avatar user={notif.from} size="sm" />
            ) : (
              <div className="w-9 h-9 gradient-bg rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-base">⚡</span>
              </div>
            )}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm leading-relaxed">
                {notif.from && <span className="font-semibold">{notif.from.displayName} </span>}
                {notif.text}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 gradient-bg rounded-full flex-shrink-0 mt-2" />
            )}
            {notif.type === 'contact' && !notif.read && (
              <div className="flex gap-1 flex-shrink-0">
                <button className="h-7 px-3 gradient-bg rounded-lg text-xs font-medium text-white">
                  Принять
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
