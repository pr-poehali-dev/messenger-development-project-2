import React, { useState } from 'react';
import { User } from './types';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface SearchScreenProps {
  allUsers: User[];
  onStartChat: (user: User) => void;
}

export default function SearchScreen({ allUsers, onStartChat }: SearchScreenProps) {
  const [query, setQuery] = useState('');

  const cleanQuery = query.startsWith('@') ? query.slice(1) : query;
  const results = cleanQuery.length >= 1
    ? allUsers.filter(u =>
        u.username.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        u.displayName.toLowerCase().includes(cleanQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-black">Поиск</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Найдите друга по юзернейму</p>
      </div>

      <div className="px-4 mb-4">
        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3">
          <Icon name="Search" size={18} className="text-muted-foreground flex-shrink-0" />
          <input
            className="bg-transparent flex-1 outline-none text-sm placeholder:text-muted-foreground/50"
            placeholder="@username или имя..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
      </div>

      {cleanQuery.length >= 1 && results.length === 0 && (
        <div className="px-4 text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold">Никого не нашли</p>
          <p className="text-muted-foreground text-sm mt-1">Попробуйте другой юзернейм</p>
        </div>
      )}

      <div className="px-2">
        {results.map((user, i) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-card/80 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Avatar user={user} size="md" showOnline />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{user.displayName}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
              {user.bio && <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{user.bio}</p>}
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={() => onStartChat(user)}
                className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center transition-all hover:opacity-90 active:scale-90"
              >
                <Icon name="MessageCircle" size={16} className="text-white" />
              </button>
              <button className="w-9 h-9 glass rounded-xl flex items-center justify-center transition-all hover:bg-primary/10">
                <Icon name="UserPlus" size={16} className="text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {query.length === 0 && (
        <div className="px-4 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 glass rounded-3xl mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <p className="font-semibold">Найдите новых друзей</p>
          <p className="text-muted-foreground text-sm mt-1">Введите @юзернейм или имя</p>
        </div>
      )}
    </div>
  );
}