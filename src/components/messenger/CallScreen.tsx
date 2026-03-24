import React, { useState, useEffect } from 'react';
import { User } from './types';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface CallScreenProps {
  user: User;
  type: 'audio' | 'video';
  onEnd: () => void;
}

export default function CallScreen({ user, type, onEnd }: CallScreenProps) {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<'calling' | 'connected'>('calling');
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(type === 'video');

  useEffect(() => {
    const connectTimer = setTimeout(() => setStatus('connected'), 2000);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (status !== 'connected') return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ background: 'linear-gradient(160deg, #1a0533 0%, #0a1628 50%, #051a1a 100%)' }}>
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full opacity-30 blur-3xl animate-pulse" style={{ background: 'hsl(262,83%,50%)' }} />
        <div className="absolute bottom-[20%] right-[-10%] w-60 h-60 rounded-full opacity-20 blur-3xl animate-pulse" style={{ background: 'hsl(186,100%,40%)', animationDelay: '1s' }} />
      </div>

      {/* Top info */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
        {/* Call type badge */}
        <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1 mb-8">
          <Icon name={type === 'video' ? 'Video' : 'Phone'} size={12} className="text-primary" />
          <span className="text-xs text-muted-foreground">{type === 'video' ? 'Видеозвонок' : 'Голосовой звонок'}</span>
        </div>

        {/* Avatar with pulse rings */}
        <div className="relative mb-6">
          {status === 'calling' && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ transform: 'scale(1.3)' }} />
              <div className="absolute inset-0 rounded-full border-2 border-primary/15 animate-ping" style={{ transform: 'scale(1.6)', animationDelay: '0.3s' }} />
            </>
          )}
          <Avatar user={user} size="xl" />
          {status === 'connected' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black text-white mb-1">{user.displayName}</h2>
        <p className="text-muted-foreground text-sm mb-2">@{user.username}</p>

        <p className={`text-sm font-medium ${status === 'connected' ? 'text-green-400' : 'text-primary animate-pulse'}`}>
          {status === 'calling' ? 'Звоним...' : formatTime(seconds)}
        </p>

        {/* Video placeholder */}
        {type === 'video' && status === 'connected' && cameraOn && (
          <div className="mt-6 w-full max-w-xs h-48 glass rounded-3xl flex items-center justify-center border border-white/10">
            <div className="text-center">
              <span className="text-4xl">📷</span>
              <p className="text-xs text-muted-foreground mt-2">Видео недоступно в демо-режиме</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 px-8 pb-14">
        {/* Secondary controls */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setMuted(v => !v)}
            className={`flex flex-col items-center gap-2`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${muted ? 'bg-white/20' : 'glass'}`}>
              <Icon name={muted ? 'MicOff' : 'Mic'} size={20} className={muted ? 'text-white' : 'text-muted-foreground'} />
            </div>
            <span className="text-xs text-muted-foreground">{muted ? 'Включить' : 'Выключить'}</span>
          </button>

          <button
            onClick={() => setSpeakerOn(v => !v)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${speakerOn ? 'bg-white/20' : 'glass'}`}>
              <Icon name={speakerOn ? 'Volume2' : 'VolumeX'} size={20} className={speakerOn ? 'text-white' : 'text-muted-foreground'} />
            </div>
            <span className="text-xs text-muted-foreground">Динамик</span>
          </button>

          {type === 'video' && (
            <button
              onClick={() => setCameraOn(v => !v)}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${!cameraOn ? 'bg-white/20' : 'glass'}`}>
                <Icon name={cameraOn ? 'Camera' : 'CameraOff'} size={20} className={!cameraOn ? 'text-white' : 'text-muted-foreground'} />
              </div>
              <span className="text-xs text-muted-foreground">Камера</span>
            </button>
          )}
        </div>

        {/* End call button */}
        <div className="flex justify-center">
          <button
            onClick={onEnd}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:bg-red-600 active:scale-90"
            style={{ boxShadow: '0 0 30px rgba(239,68,68,0.5)' }}
          >
            <Icon name="PhoneOff" size={26} className="text-white" />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">Завершить звонок</p>
      </div>
    </div>
  );
}
