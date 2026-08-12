import clsx from 'clsx';

export default function Badge({ children, tone = 'default', className }) {
  const tones = {
    default: 'bg-panel-2 text-muted border-line',
    signal: 'bg-signal/10 text-signal border-signal/30',
    pulse: 'bg-pulse/10 text-pulse border-pulse/30',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-mono tracking-wide',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
