import Section from './Section';
import TechTile from '@/components/shared/TechTile';

const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Bases de datos',
  devops: 'DevOps',
  ai: 'IA',
  tools: 'Herramientas',
  'soft-skills': 'Habilidades blandas',
  other: 'Otras',
};

export default function SkillsBlock({ block }) {
  const skills = block.data?.skills || [];
  if (skills.length === 0) return null;

  const grouped = skills.reduce((acc, skill) => {
    const key = skill.category || 'other';
    acc[key] = acc[key] || [];
    acc[key].push(skill);
    return acc;
  }, {});

  return (
    <Section eyebrow="Habilidades y tecnologías">
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <p className="mb-3 text-xs uppercase tracking-wide text-white/40">{CATEGORY_LABELS[category] || category}</p>
            <div className="flex flex-wrap gap-5">
              {items.map((skill) => (
                <TechTile key={skill.name} name={skill.name} iconUrl={skill.icon} size="md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
