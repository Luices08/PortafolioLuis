'use client';

import clsx from 'clsx';

const variants = {
  primary: 'bg-signal text-ink hover:bg-signal/90 shadow-signal',
  secondary: 'bg-panel-2 text-paper border border-line hover:border-signal/50',
  ghost: 'text-muted hover:text-paper hover:bg-panel-2',
  danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
}
