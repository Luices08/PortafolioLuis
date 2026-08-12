import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SkillIconProvider } from '@/context/SkillIconContext';

export const metadata = {
  title: 'Portafolio Conversacional',
  description: 'Un portafolio profesional que se explora conversando con un asistente de IA.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <SkillIconProvider>{children}</SkillIconProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
