import { Brain, User } from 'lucide-react';

interface ChatAvatarProps {
  type: 'user' | 'assistant';
  userName?: string;
}

export const ChatAvatar = ({ type, userName }: ChatAvatarProps) => {
  if (type === 'assistant') {
    return (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Brain className="w-5 h-5 text-primary" />
      </div>
    );
  }

  // User avatar with initials
  const initials = userName
    ? userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
      {initials}
    </div>
  );
};
