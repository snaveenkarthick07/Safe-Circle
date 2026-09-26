'use client';

import React, { useState } from 'react';
import { User, UserRole } from '@/types';
import { Shield, Users, Building2, GraduationCap, UserCheck } from 'lucide-react';

interface UserAvatarProps {
  user?: Partial<User> | null;
  name?: string;
  avatar?: string;
  role?: UserRole | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
  ring?: boolean;
}

export function UserAvatar({
  user,
  name: propName,
  avatar: propAvatar,
  role: propRole,
  size = 'md',
  className = '',
  showBadge = false,
  ring = true,
}: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const name = propName || user?.name || 'SafeCircle User';
  const avatar = propAvatar !== undefined ? propAvatar : user?.avatar;
  const role = propRole || user?.role || 'user';

  // Compute initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p.charAt(0).toUpperCase())
    .join('') || 'SC';

  // Size mappings
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  }[size];

  const ringClass = ring
    ? role === 'authority'
      ? 'ring-2 ring-blue-500/50'
      : role === 'guardian'
      ? 'ring-2 ring-purple-500/50'
      : role === 'organization'
      ? 'ring-2 ring-emerald-500/50'
      : 'ring-2 ring-pink-500/50'
    : '';

  // Gradient by role for fallback initials
  const gradientClass =
    role === 'authority'
      ? 'from-blue-600 to-indigo-700 text-white'
      : role === 'guardian'
      ? 'from-purple-600 to-indigo-700 text-white'
      : role === 'organization'
      ? 'from-emerald-600 to-teal-700 text-white'
      : 'from-pink-600 to-rose-600 text-white';

  const badgeIcon = {
    user: '👩',
    guardian: '🛡️',
    authority: '👮',
    organization: '🎓',
    admin: '⚡',
  }[role as string] || '👤';

  const hasValidPhoto = Boolean(avatar && avatar.trim().length > 0 && !imageFailed);

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} ${ringClass} rounded-full overflow-hidden flex items-center justify-center font-bold tracking-tight shadow-sm select-none transition-transform`}
      >
        {hasValidPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center font-black`}>
            {initials}
          </div>
        )}
      </div>

      {showBadge && (
        <span
          className="absolute -bottom-1 -right-1 text-xs bg-slate-900 rounded-full w-4 h-4 flex items-center justify-center shadow-md border border-slate-700"
          title={`Role: ${role}`}
        >
          <span className="text-[10px] leading-none">{badgeIcon}</span>
        </span>
      )}
    </div>
  );
}
