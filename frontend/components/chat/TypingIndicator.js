export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="transmission-label">SEÑAL · recibiendo</span>
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-signal [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-signal [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-signal [animation-delay:300ms]" />
      </div>
    </div>
  );
}
