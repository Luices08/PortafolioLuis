import clsx from 'clsx';

export default function Input({ label, error, className, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-paper">{label}</span>}
      <input
        className={clsx(
          'w-full rounded-lg border border-line bg-panel-2 px-3 py-2.5 text-paper placeholder:text-muted/60',
          'focus:border-signal/60 focus:outline-none transition-colors',
          error && 'border-danger/60',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
