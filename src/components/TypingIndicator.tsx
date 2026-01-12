export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
      <span>AI pisze</span>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};
