interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}

export default function ProgressBar({ value, size = 'md', showLabel = true, color }: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const barColor = color || (
    value >= 100 ? 'bg-emerald-500' :
    value >= 60 ? 'bg-accent' :
    value >= 30 ? 'bg-amber-500' :
    'bg-red-400'
  );

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-surface-2 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-text-secondary tabular-nums w-10 text-right">
          {value}%
        </span>
      )}
    </div>
  );
}
