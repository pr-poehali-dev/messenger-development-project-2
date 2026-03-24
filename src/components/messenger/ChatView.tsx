import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message } from './types';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatViewProps {
  chat: Chat;
  onBack: () => void;
  onUpdateChat: (chatId: string, messages: Message[]) => void;
  onCall: (type: 'audio' | 'video') => void;
}

export default function ChatView({ chat, onBack, onUpdateChat, onCall }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [showAttach, setShowAttach] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => { if (recordTimerRef.current) clearInterval(recordTimerRef.current); };
  }, []);

  const addMessage = (msg: Message) => {
    setMessages(prev => {
      const updated = [...prev, msg];
      onUpdateChat(chat.id, updated);
      return updated;
    });
  };

  const send = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: now(),
      isOwn: true,
      status: 'sent',
    };
    addMessage(msg);
    setText('');
    autoReply([...messages, msg]);
  };

  const autoReply = (current: Message[]) => {
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: getReply(),
        timestamp: now(),
        isOwn: false,
        status: 'read',
      };
      setMessages(prev => {
        const updated = [...prev, reply];
        onUpdateChat(chat.id, updated);
        return updated;
      });
    }, 1200);
  };

  const now = () => new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

  const getReply = () => {
    const replies = ['Отлично! 👍', 'Понял, спасибо!', 'Хорошо, договорились 🤝', 'Интересно...', 'Да, конечно!', '😊', 'Ок!', 'Классно!', 'Понял тебя!'];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttach(false);
    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');
    const url = URL.createObjectURL(file);
    const msg: Message = {
      id: Date.now().toString(),
      text: '',
      timestamp: now(),
      isOwn: true,
      status: 'sent',
      mediaType: isImage ? 'image' : isAudio ? 'audio' : undefined,
      mediaUrl: url,
      mediaName: file.name,
    };
    addMessage(msg);
    e.target.value = '';
    autoReply([...messages, msg]);
  };

  const startRecording = () => {
    setRecording(true);
    setRecordSeconds(0);
    recordTimerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
  };

  const stopRecording = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setRecording(false);
    const duration = `${Math.floor(recordSeconds / 60)}:${String(recordSeconds % 60).padStart(2, '0')}`;
    const msg: Message = {
      id: Date.now().toString(),
      text: '',
      timestamp: now(),
      isOwn: true,
      status: 'sent',
      mediaType: 'audio',
      mediaName: 'Голосовое сообщение',
      mediaDuration: duration,
    };
    addMessage(msg);
    autoReply([...messages, msg]);
    setRecordSeconds(0);
  };

  const fmtDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

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
        <button onClick={() => onCall('audio')} className="text-muted-foreground hover:text-foreground transition-colors p-2">
          <Icon name="Phone" size={18} />
        </button>
        <button onClick={() => onCall('video')} className="text-muted-foreground hover:text-foreground transition-colors p-2">
          <Icon name="Video" size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" onClick={() => setShowAttach(false)}>
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
          >
            {!msg.isOwn && (
              <div className="mr-2 flex-shrink-0 self-end mb-1">
                <Avatar user={chat.user} size="sm" />
              </div>
            )}
            <div className={`max-w-[75%] ${msg.isOwn ? 'msg-bubble-out' : 'msg-bubble-in'} overflow-hidden`}>
              {/* Image */}
              {msg.mediaType === 'image' && msg.mediaUrl && (
                <div className="rounded-2xl overflow-hidden">
                  <img src={msg.mediaUrl} alt="фото" className="max-w-full max-h-60 object-cover w-full" />
                  <div className={`flex items-center gap-1 px-3 py-1.5 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs opacity-60">{msg.timestamp}</span>
                    {msg.isOwn && <Icon name={msg.status === 'read' ? 'CheckCheck' : 'Check'} size={12} className="opacity-60" />}
                  </div>
                </div>
              )}
              {/* Audio */}
              {msg.mediaType === 'audio' && (
                <div className="px-4 py-3 flex items-center gap-3 min-w-[180px]">
                  <button className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isOwn ? 'bg-white/20' : 'gradient-bg'}`}>
                    <Icon name="Play" size={16} className={msg.isOwn ? 'text-white' : 'text-white'} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-0.5 items-end h-6">
                      {Array.from({ length: 20 }).map((_, j) => (
                        <div key={j} className={`w-1 rounded-full opacity-60 ${msg.isOwn ? 'bg-white' : 'bg-primary'}`} style={{ height: `${Math.random() * 16 + 4}px` }} />
                      ))}
                    </div>
                    <p className="text-xs opacity-60 mt-0.5">{msg.mediaDuration || '0:00'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs opacity-60">{msg.timestamp}</span>
                    {msg.isOwn && <Icon name={msg.status === 'read' ? 'CheckCheck' : 'Check'} size={12} className="opacity-60" />}
                  </div>
                </div>
              )}
              {/* Text */}
              {!msg.mediaType && (
                <div className="px-4 py-2.5">
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs opacity-60">{msg.timestamp}</span>
                    {msg.isOwn && <Icon name={msg.status === 'read' ? 'CheckCheck' : 'Check'} size={12} className="opacity-60" />}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Attach menu */}
      {showAttach && (
        <div className="px-4 pb-2 animate-fade-in">
          <div className="glass rounded-2xl p-3 flex gap-3">
            <label className="flex flex-col items-center gap-1.5 cursor-pointer flex-1 py-2 rounded-xl hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <Icon name="Image" size={18} className="text-white" />
              </div>
              <span className="text-xs text-muted-foreground">Фото</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
            <label className="flex flex-col items-center gap-1.5 cursor-pointer flex-1 py-2 rounded-xl hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}>
                <Icon name="FileAudio" size={18} className="text-white" />
              </div>
              <span className="text-xs text-muted-foreground">Аудио</span>
              <input type="file" accept="audio/*" className="hidden" onChange={handleFile} />
            </label>
            <label className="flex flex-col items-center gap-1.5 cursor-pointer flex-1 py-2 rounded-xl hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                <Icon name="File" size={18} className="text-white" />
              </div>
              <span className="text-xs text-muted-foreground">Файл</span>
              <input type="file" className="hidden" onChange={handleFile} />
            </label>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass border-t border-border px-4 py-3 flex items-end gap-2 flex-shrink-0">
        {recording ? (
          <>
            <div className="flex-1 glass rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm text-red-400 font-medium">{fmtDuration(recordSeconds)}</span>
              <span className="text-xs text-muted-foreground">Запись голосового...</span>
            </div>
            <button
              onClick={stopRecording}
              className="flex-shrink-0 w-11 h-11 bg-red-400 rounded-2xl flex items-center justify-center transition-all hover:opacity-90 active:scale-90"
            >
              <Icon name="Square" size={16} className="text-white" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowAttach(v => !v)}
              className={`text-muted-foreground hover:text-primary transition-colors p-2 flex-shrink-0 ${showAttach ? 'text-primary' : ''}`}
            >
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
            {text.trim() ? (
              <button
                onClick={send}
                className="flex-shrink-0 w-11 h-11 gradient-bg rounded-2xl flex items-center justify-center transition-all hover:opacity-90 active:scale-90 neon-glow"
              >
                <Icon name="Send" size={18} className="text-white" />
              </button>
            ) : (
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className="flex-shrink-0 w-11 h-11 glass rounded-2xl flex items-center justify-center transition-all hover:bg-primary/20 active:scale-90"
              >
                <Icon name="Mic" size={18} className="text-muted-foreground" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}