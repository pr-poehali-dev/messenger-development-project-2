import React, { useState } from 'react';
import { User } from './types';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ProfileScreenProps {
  user: User;
  onUpdate: (user: User) => void;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onUpdate, onLogout }: ProfileScreenProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: user.displayName, bio: user.bio || '', username: user.username });

  const save = () => {
    onUpdate({ ...user, ...form });
    setEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="relative px-4 pt-10 pb-6 text-center">
        <div className="absolute inset-0 opacity-10 blur-3xl" style={{ background: user.avatarGradient }} />
        <div className="relative">
          <div className="inline-block mb-4">
            <Avatar user={user} size="xl" showOnline />
          </div>
          {editing ? (
            <div className="space-y-3 max-w-xs mx-auto">
              <input
                className="w-full glass rounded-2xl px-4 py-2.5 text-sm outline-none text-center font-bold text-lg"
                value={form.displayName}
                onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              />
              <div className="flex items-center justify-center gap-1 glass rounded-2xl px-4 py-2.5">
                <span className="text-muted-foreground text-sm">@</span>
                <input
                  className="bg-transparent text-sm outline-none text-center"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                />
              </div>
              <input
                className="w-full glass rounded-2xl px-4 py-2.5 text-sm outline-none text-center text-muted-foreground"
                placeholder="О себе..."
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              />
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex-1 glass rounded-2xl py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Отмена
                </button>
                <button onClick={save} className="flex-1 gradient-bg rounded-2xl py-2.5 text-sm font-semibold text-white">
                  Сохранить
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black">{user.displayName}</h2>
              <p className="text-muted-foreground text-sm mt-0.5">@{user.username}</p>
              {user.bio && <p className="text-sm mt-2 text-muted-foreground/80">{user.bio}</p>}
              <button
                onClick={() => setEditing(true)}
                className="mt-4 glass rounded-2xl px-5 py-2 text-sm font-medium flex items-center gap-2 mx-auto hover:bg-primary/10 transition-colors"
              >
                <Icon name="Pencil" size={14} /> Редактировать профиль
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4">
        <div className="glass rounded-2xl p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-black gradient-text">5</p>
            <p className="text-xs text-muted-foreground mt-0.5">Чатов</p>
          </div>
          <div>
            <p className="text-2xl font-black gradient-text">6</p>
            <p className="text-xs text-muted-foreground mt-0.5">Контактов</p>
          </div>
          <div>
            <p className="text-2xl font-black gradient-text">24</p>
            <p className="text-xs text-muted-foreground mt-0.5">Дней в Pulse</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 mb-4">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
            <Icon name="AtSign" size={18} className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Юзернейм</p>
              <p className="text-sm font-medium">@{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Icon name="Info" size={18} className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">О себе</p>
              <p className="text-sm font-medium">{user.bio || 'Не указано'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 pb-8">
        <button
          onClick={onLogout}
          className="w-full glass rounded-2xl py-3.5 text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center gap-2"
        >
          <Icon name="LogOut" size={16} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
