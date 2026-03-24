import { User, Chat, Notification } from './types';

export const GRADIENTS = [
  'linear-gradient(135deg, #8B5CF6, #06B6D4)',
  'linear-gradient(135deg, #EC4899, #8B5CF6)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #10B981, #06B6D4)',
  'linear-gradient(135deg, #F97316, #EC4899)',
  'linear-gradient(135deg, #6366F1, #8B5CF6)',
  'linear-gradient(135deg, #14B8A6, #3B82F6)',
  'linear-gradient(135deg, #A855F7, #EC4899)',
];

export const mockUsers: User[] = [
  { id: '2', username: 'alex_k', displayName: 'Алекс Климов', avatarGradient: GRADIENTS[0], bio: 'Дизайнер интерфейсов 🎨', online: true },
  { id: '3', username: 'marina_v', displayName: 'Марина Волкова', avatarGradient: GRADIENTS[1], bio: 'Люблю кофе и код ☕', online: false, lastSeen: '5 мин назад' },
  { id: '4', username: 'dmitry_s', displayName: 'Дмитрий Соколов', avatarGradient: GRADIENTS[2], bio: 'Путешественник 🌍', online: true },
  { id: '5', username: 'kate_m', displayName: 'Катя Миронова', avatarGradient: GRADIENTS[3], bio: 'Фотограф | Москва', online: false, lastSeen: '1 час назад' },
  { id: '6', username: 'ivan_p', displayName: 'Иван Петров', avatarGradient: GRADIENTS[4], bio: 'Разработчик 💻', online: true },
  { id: '7', username: 'olga_n', displayName: 'Ольга Новикова', avatarGradient: GRADIENTS[5], bio: 'Маркетолог 📊', online: false, lastSeen: '2 часа назад' },
];

export const mockChats: Chat[] = [
  {
    id: '1', user: mockUsers[0], lastMessage: 'Отлично, жду твой макет!', lastTime: '14:32', unread: 2,
    messages: [
      { id: '1', text: 'Привет! Как дела с проектом?', timestamp: '14:20', isOwn: false, status: 'read' },
      { id: '2', text: 'Всё идёт по плану, почти готово 🔥', timestamp: '14:25', isOwn: true, status: 'read' },
      { id: '3', text: 'Отлично, жду твой макет!', timestamp: '14:32', isOwn: false, status: 'read' },
    ]
  },
  {
    id: '2', user: mockUsers[1], lastMessage: 'Встретимся в 19:00?', lastTime: '13:15', unread: 0,
    messages: [
      { id: '1', text: 'Привет! Ты свободна сегодня вечером?', timestamp: '13:00', isOwn: true, status: 'read' },
      { id: '2', text: 'Да, всё ок!', timestamp: '13:10', isOwn: false, status: 'read' },
      { id: '3', text: 'Встретимся в 19:00?', timestamp: '13:15', isOwn: false, status: 'read' },
    ]
  },
  {
    id: '3', user: mockUsers[2], lastMessage: 'Смотри какое фото из Токио!', lastTime: 'Вчера', unread: 5,
    messages: [
      { id: '1', text: 'Дима, ты уже вернулся?', timestamp: 'Вчера', isOwn: true, status: 'read' },
      { id: '2', text: 'Смотри какое фото из Токио!', timestamp: 'Вчера', isOwn: false, status: 'read' },
    ]
  },
  {
    id: '4', user: mockUsers[3], lastMessage: 'Спасибо за помощь!', lastTime: 'Пн', unread: 0,
    messages: [
      { id: '1', text: 'Спасибо за помощь!', timestamp: 'Пн', isOwn: false, status: 'read' },
    ]
  },
  {
    id: '5', user: mockUsers[4], lastMessage: 'Код работает, всё ок 🎉', lastTime: 'Вс', unread: 1,
    messages: [
      { id: '1', text: 'Код работает, всё ок 🎉', timestamp: 'Вс', isOwn: false, status: 'read' },
    ]
  },
];

export const mockNotifications: Notification[] = [
  { id: '1', type: 'message', text: 'написал(а) вам сообщение', from: mockUsers[0], time: '14:32', read: false },
  { id: '2', type: 'contact', text: 'добавил(а) вас в контакты', from: mockUsers[2], time: '13:00', read: false },
  { id: '3', type: 'message', text: 'отправил(а) вам фото', from: mockUsers[2], time: 'Вчера', read: true },
  { id: '4', type: 'system', text: 'Добро пожаловать в Pulse! Найдите друзей по юзернейму 🚀', time: '2 дня назад', read: true },
  { id: '5', type: 'contact', text: 'добавил(а) вас в контакты', from: mockUsers[4], time: '3 дня назад', read: true },
];

export const currentUser: User = {
  id: '1',
  username: 'me_user',
  displayName: 'Вы',
  avatarGradient: GRADIENTS[7],
  bio: 'Привет! Я использую Pulse 👋',
  online: true,
};
