import React from 'react';
import { User } from './types';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ContactsScreenProps {
  contacts: User[];
  onStartChat: (user: User) => void;
}

export default function ContactsScreen({ contacts, onStartChat }: ContactsScreenProps) {
  const online = contacts.filter(c => c.online);
  const offline = contacts.filter(c => !c.online);

  const ContactCard = ({ user, delay }: { user: User; delay: number }) => (
    <div
      className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-card/80 transition-all animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Avatar user={user} size="md" showOnline />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{user.displayName}</p>
        <p className="text-xs text-muted-foreground">@{user.username}</p>
        {user.bio && <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{user.bio}</p>}
      </div>
      <button
        onClick={() => onStartChat(user)}
        className="flex-shrink-0 w-9 h-9 gradient-bg rounded-xl flex items-center justify-center transition-all hover:opacity-90 active:scale-90"
      >
        <Icon name="MessageCircle" size={16} className="text-white" />
      </button>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-black">Контакты</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{contacts.length} человек</p>
      </div>

      <div className="px-2">
        {online.length > 0 && (
          <>
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">В сети — {online.length}</span>
            </div>
            {online.map((user, i) => <ContactCard key={user.id} user={user} delay={i * 50} />)}
          </>
        )}

        {offline.length > 0 && (
          <>
            <div className="px-3 py-2 flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Не в сети — {offline.length}</span>
            </div>
            {offline.map((user, i) => <ContactCard key={user.id} user={user} delay={(online.length + i) * 50} />)}
          </>
        )}
      </div>
    </div>
  );
}
