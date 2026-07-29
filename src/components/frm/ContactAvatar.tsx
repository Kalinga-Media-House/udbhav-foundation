import { User } from 'lucide-react';

interface ContactAvatarProps {
  photoUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ContactAvatar({ photoUrl, name, size = 'md', className = '' }: ContactAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-medium ${sizeClasses[size]} ${className}`}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : name ? (
        getInitials(name)
      ) : (
        <User className="w-1/2 h-1/2" />
      )}
    </div>
  );
}
