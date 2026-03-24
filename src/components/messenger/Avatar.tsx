import React from 'react';
import { User } from './types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnline?: boolean;
}

const sizes = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
};

export default function Avatar({ user, size = 'md', showOnline = false }: AvatarProps) {
  const initials = user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={`relative flex-shrink-0 ${sizes[size]}`}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-bold text-white"
        style={{ background: user.avatarGradient }}
      >
        {initials}
      </div>
      {showOnline && user.online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
      )}
    </div>
  );
}
