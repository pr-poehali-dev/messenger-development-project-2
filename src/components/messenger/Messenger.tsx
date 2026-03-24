import React, { useState } from 'react';
import { Screen, Chat, User, Message } from './types';
import { mockChats, mockUsers, mockNotifications, currentUser as defaultUser } from './data';
import AuthScreen from './AuthScreen';
import ChatsScreen from './ChatsScreen';
import ChatView from './ChatView';
import ContactsScreen from './ContactsScreen';
import SearchScreen from './SearchScreen';
import NotificationsScreen from './NotificationsScreen';
import SettingsScreen from './SettingsScreen';
import ProfileScreen from './ProfileScreen';
import BottomNav from './BottomNav';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function Messenger() {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [screen, setScreen] = useState<Screen>('chats');
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleAuth = (username: string, displayName: string) => {
    setCurrentUser(u => ({ ...u, username, displayName }));
    setAuthed(true);
    setScreen('chats');
  };

  const handleLogout = () => {
    setAuthed(false);
    setScreen('chats');
    setActiveChat(null);
    setShowProfile(false);
  };

  const handleOpenChat = (chat: Chat) => {
    setActiveChat(chat);
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
  };

  const handleStartChat = (user: User) => {
    const existing = chats.find(c => c.user.id === user.id);
    if (existing) {
      handleOpenChat(existing);
    } else {
      const newChat: Chat = {
        id: Date.now().toString(),
        user,
        lastMessage: 'Начните диалог...',
        lastTime: 'Сейчас',
        unread: 0,
        messages: [],
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat);
    }
    setScreen('chats');
  };

  const handleUpdateChat = (chatId: string, messages: Message[]) => {
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const last = messages[messages.length - 1];
      return {
        ...c,
        messages,
        lastMessage: last?.text || c.lastMessage,
        lastTime: last?.timestamp || c.lastTime,
      };
    }));
  };

  const unreadChats = chats.reduce((sum, c) => sum + c.unread, 0);
  const unreadNotifs = mockNotifications.filter(n => !n.read).length;

  if (!authed) return <AuthScreen onAuth={handleAuth} />;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden relative">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] right-[-20%] w-80 h-80 rounded-full opacity-5 blur-3xl" style={{ background: 'hsl(262,83%,68%)' }} />
        <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 rounded-full opacity-5 blur-3xl" style={{ background: 'hsl(186,100%,50%)' }} />
      </div>

      {/* Top header (not in chat or profile) */}
      {!activeChat && !showProfile && (
        <div className="glass border-b border-border flex-shrink-0 px-4 py-3 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black gradient-text">Pulse</span>
            <span className="text-muted-foreground/30">⚡</span>
          </div>
          <button onClick={() => setShowProfile(true)} className="relative">
            <Avatar user={currentUser} size="sm" showOnline />
          </button>
        </div>
      )}

      {/* Profile overlay */}
      {showProfile && (
        <div className="flex-1 flex flex-col overflow-hidden animate-fade-in relative z-10">
          <div className="glass border-b border-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setShowProfile(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
              <Icon name="ChevronLeft" size={22} />
            </button>
            <span className="font-bold">Профиль</span>
          </div>
          <ProfileScreen
            user={currentUser}
            onUpdate={u => setCurrentUser(u)}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Chat view */}
      {activeChat && !showProfile && (
        <div className="flex-1 flex flex-col overflow-hidden animate-fade-in relative z-10">
          <ChatView
            chat={activeChat}
            onBack={() => setActiveChat(null)}
            onUpdateChat={handleUpdateChat}
          />
        </div>
      )}

      {/* Main screens */}
      {!activeChat && !showProfile && (
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {screen === 'chats' && (
            <ChatsScreen chats={chats} onOpenChat={handleOpenChat} />
          )}
          {screen === 'contacts' && (
            <ContactsScreen contacts={mockUsers} onStartChat={handleStartChat} />
          )}
          {screen === 'search' && (
            <SearchScreen allUsers={mockUsers} onStartChat={handleStartChat} />
          )}
          {screen === 'notifications' && (
            <NotificationsScreen notifications={mockNotifications} />
          )}
          {screen === 'settings' && <SettingsScreen user={currentUser} onLogout={handleLogout} />}
        </div>
      )}

      {/* Bottom nav */}
      {!activeChat && !showProfile && (
        <BottomNav
          active={screen}
          onChange={setScreen}
          unreadChats={unreadChats}
          unreadNotifs={unreadNotifs}
        />
      )}
    </div>
  );
}