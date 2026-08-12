import clsx from 'clsx';

export default function Select({ label, error, className, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-paper">{label}</span>}
      <select
        className={clsx(
          'w-full rounded-lg border border-line bg-panel-2 px-3 py-2.5 text-paper',
          'focus:border-signal/60 focus:outline-none transition-colors',
          error && 'border-danger/60',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
