import { Mail, Github, Linkedin, Twitter, Globe } from 'lucide-react';

const ICONS = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe };

export default function ContactBlock({ data }) {
  if (!data) return null;
  const { email, socialLinks = {} } = data;

  const links = Object.entries(socialLinks).filter(([, url]) => url);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-panel-2 p-4">
      {email && (
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-paper hover:text-signal"
        >
          <Mail size={16} /> {email}
        </a>
      )}
      {links.map(([key, url]) => {
        const Icon = ICONS[key] || Globe;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-signal"
          >
            <Icon size={16} /> {key}
          </a>
        );
      })}
    </div>
  );
}
