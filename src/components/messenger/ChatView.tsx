import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message } from './types';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatViewProps {
  chat: Chat;
  onBack: () => void;
  onUpdateChat: (chatId: string, messages: Message[]) => void;
}

export default function ChatView({ chat, onBack, onUpdateChat }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent',
    };
    const updated = [...messages, msg];
    setMessages(updated);
    onUpdateChat(chat.id, updated);
    setText('');

    // Auto-reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: getReply(),
        timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        status: 'read',
      };
      setMessages(prev => [...prev, reply]);
      onUpdateChat(chat.id, [...updated, reply]);
    }, 1200);
  };

  const getReply = () => {
    const replies = ['Отлично! 👍', 'Понял, спасибо!', 'Хорошо, договорились 🤝', 'Интересно...', 'Да, конечно!', '😊', 'Ок!', 'Классно!'];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass border-b border-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
          <Icon name="ChevronLeft" size={22} />
        </button>
        <Avatar user={chat.user} size="sm" showOnline />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{chat.user.displayName}</p>
          <p className="text-xs text-muted-foreground">
            {chat.user.online ? <span className="text-green-400">в сети</span> : chat.user.lastSeen}
          </p>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
          <Icon name="Phone" size={18} />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
          <Icon name="Video" size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {!msg.isOwn && (
              <div className="mr-2 flex-shrink-0 self-end mb-1">
                <Avatar user={chat.user} size="sm" />
              </div>
            )}
            <div className={`max-w-[75%] ${msg.isOwn ? 'msg-bubble-out' : 'msg-bubble-in'} px-4 py-2.5`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs opacity-60">{msg.timestamp}</span>
                {msg.isOwn && (
                  <Icon name={msg.status === 'read' ? 'CheckCheck' : 'Check'} size={12} className="opacity-60" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass border-t border-border px-4 py-3 flex items-end gap-2 flex-shrink-0">
        <button className="text-muted-foreground hover:text-primary transition-colors p-2 flex-shrink-0">
          <Icon name="Paperclip" size={20} />
        </button>
        <div className="flex-1 glass rounded-2xl px-4 py-2.5 min-h-[44px] flex items-center">
          <textarea
            className="w-full bg-transparent outline-none text-sm resize-none max-h-32 placeholder:text-muted-foreground/50"
            placeholder="Написать сообщение..."
            rows={1}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
        </div>
        <button
          onClick={send}
          disabled={!text.trim()}
          className="flex-shrink-0 w-11 h-11 gradient-bg rounded-2xl flex items-center justify-center transition-all hover:opacity-90 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed neon-glow"
        >
          <Icon name="Send" size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
