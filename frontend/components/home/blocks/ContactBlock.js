import { Mail, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import Section from './Section';

const ICONS = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe };

export default function ContactBlock({ block }) {
  const data = block.data;
  if (!data) return null;
  const { email, socialLinks = {} } = data;
  const links = Object.entries(socialLinks).filter(([, url]) => url);

  return (
    <Section eyebrow="Contacto">
      <div className="flex flex-wrap items-center gap-3">
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-100 hover:bg-violet-500/20"
          >
            <Mail size={15} /> {email}
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
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm capitalize text-white/70 hover:border-violet-300/30 hover:text-white"
            >
              <Icon size={15} /> {key}
            </a>
          );
        })}
      </div>
    </Section>
  );
}
