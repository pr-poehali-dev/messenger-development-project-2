export type Screen = 'auth' | 'chats' | 'contacts' | 'search' | 'notifications' | 'settings' | 'chat' | 'profile';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  avatarGradient: string;
  bio?: string;
  phone?: string;
  email?: string;
  online: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  type: 'message' | 'contact' | 'system';
  text: string;
  from?: User;
  time: string;
  read: boolean;
}
