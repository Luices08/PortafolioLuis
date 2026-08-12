import Badge from '@/components/ui/Badge';

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

export default function SkillListBlock({ data }) {
  const skills = data?.skills || [];
  if (skills.length === 0) return null;

  const grouped = skills.reduce((acc, skill) => {
    const key = skill.category || 'other';
    acc[key] = acc[key] || [];
    acc[key].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-3 rounded-xl border border-line bg-panel-2 p-4">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <p className="transmission-label mb-1.5">{CATEGORY_LABELS[category] || category}</p>
          <div className="flex flex-wrap gap-1.5">
            {items.map((skill) => (
              <Badge key={skill.name} tone="pulse">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
