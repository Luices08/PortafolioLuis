import ProjectsBlock from './ProjectsBlock';
import SkillsBlock from './SkillsBlock';
import ExperienceBlock from './ExperienceBlock';
import ContactBlock from './ContactBlock';
import LinkBlock from './LinkBlock';

const REGISTRY = {
  project: ProjectsBlock,
  project_list: ProjectsBlock,
  skill_list: SkillsBlock,
  experience: ExperienceBlock,
  contact: ContactBlock,
  link: LinkBlock,
};

export default function UiBlock({ block }) {
  const Component = REGISTRY[block?.type];
  if (!Component) return null;
  return <Component block={block} />;
}

export const TYPE_LABELS = {
  project: 'Proyecto',
  project_list: 'Proyectos',
  skill_list: 'Habilidades',
  experience: 'Experiencia',
  contact: 'Contacto',
  link: 'Enlace',
};
