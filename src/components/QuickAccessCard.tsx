import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAccessCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  progress?: number;
  stats?: { label: string; value: string }[];
  buttonText?: string;
  buttonLink?: string;
  onButtonClick?: () => void;
  highlighted?: boolean;
  chart?: React.ReactNode;
}

export const QuickAccessCard = ({
  icon: Icon,
  iconColor = 'text-primary',
  title,
  subtitle,
  progress,
  stats,
  buttonText,
  buttonLink,
  onButtonClick,
  highlighted = false,
  chart
}: QuickAccessCardProps) => {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${highlighted ? 'border-primary border-2' : ''}`}>
      <CardContent className="p-6 space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">{progress}% ukończone</p>
          </div>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="space-y-2">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {chart && <div className="mt-4">{chart}</div>}

        {/* Button */}
        {buttonText && (
          buttonLink ? (
            <Button asChild className="w-full" variant={highlighted ? 'default' : 'outline'}>
              <Link to={buttonLink}>{buttonText}</Link>
            </Button>
          ) : (
            <Button onClick={onButtonClick} className="w-full" variant={highlighted ? 'default' : 'outline'}>
              {buttonText}
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
};
