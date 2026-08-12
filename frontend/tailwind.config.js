/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B0E14',        // fondo principal
        panel: '#12161F',      // paneles / superficie del chat
        'panel-2': '#171C27',  // tarjetas sobre el panel
        paper: '#E7E9EE',      // texto principal
        muted: '#8A93A6',      // texto secundario
        signal: '#F2A93B',     // acento primario (ámbar de transmisión)
        'signal-dim': '#8C6224',
        pulse: '#4FD1C5',      // acento secundario (cian, estados "en vivo")
        danger: '#E5484D',
        line: 'rgba(231,233,238,0.08)',
        cosmos: '#05040d',      // fondo profundo del hero conversacional
        'cosmos-2': '#0b0a1c',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        signal: '0 0 0 1px rgba(242,169,59,0.35), 0 0 24px -4px rgba(242,169,59,0.25)',
        glow: '0 0 0 1px rgba(167,139,250,0.25), 0 0 40px -8px rgba(139,92,246,0.45)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(0.9)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
        rise: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(3%, -4%) scale(1.06)' },
          '66%': { transform: 'translate(-2%, 3%) scale(0.97)' },
        },
        driftSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-4%, 4%) scale(1.08)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.15 },
          '50%': { opacity: 0.9 },
        },
        floatChip: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.2s ease-in-out infinite',
        rise: 'rise 0.35s ease-out',
        drift: 'drift 18s ease-in-out infinite',
        driftSlow: 'driftSlow 26s ease-in-out infinite',
        twinkle: 'twinkle 3.2s ease-in-out infinite',
        floatChip: 'floatChip 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
