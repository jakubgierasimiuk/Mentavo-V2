import { Flame, Check } from 'lucide-react';

interface WeeklyStreakProps {
  weekData: { day: string; active: boolean }[];
  currentStreak: number;
}

export const WeeklyStreak = ({ weekData, currentStreak }: WeeklyStreakProps) => {
  return (
    <div className="bg-muted/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Twój tydzień</h3>
        <div className="flex items-center gap-2 text-primary">
          <Flame className="w-5 h-5" />
          <span className="font-bold">{currentStreak} dni</span>
        </div>
      </div>
      
      <div className="flex justify-between gap-2">
        {weekData.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                day.active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted border-2 border-border'
              }`}
            >
              {day.active && <Check className="w-5 h-5" />}
            </div>
            <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
