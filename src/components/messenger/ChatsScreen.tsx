import React from 'react';
import { Chat } from './types';
import Avatar from './Avatar';

interface ChatsScreenProps {
  chats: Chat[];
  onOpenChat: (chat: Chat) => void;
}

export default function ChatsScreen({ chats, onOpenChat }: ChatsScreenProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-black">Чаты</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{chats.length} диалогов</p>
      </div>

      {/* Online strip */}
      <div className="px-4 mb-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {chats.filter(c => c.user.online).map(chat => (
            <button
              key={chat.id}
              onClick={() => onOpenChat(chat)}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className="relative">
                <Avatar user={chat.user} size="md" showOnline />
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 0 2px hsl(262,83%,68%)' }} />
              </div>
              <span className="text-xs text-muted-foreground max-w-[52px] truncate">{chat.user.displayName.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="px-2">
        {chats.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => onOpenChat(chat)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-card/80 transition-all active:scale-98 text-left animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Avatar user={chat.user} size="md" showOnline />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm truncate">{chat.user.displayName}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{chat.lastTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground truncate">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="flex-shrink-0 ml-2 min-w-5 h-5 gradient-bg rounded-full flex items-center justify-center text-xs font-bold text-white px-1">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
