import ProjectBlock from './ProjectBlock';
import ProjectListBlock from './ProjectListBlock';
import SkillListBlock from './SkillListBlock';
import ExperienceBlock from './ExperienceBlock';
import ContactBlock from './ContactBlock';
import LinkBlock from './LinkBlock';

const REGISTRY = {
  project: ProjectBlock,
  project_list: ProjectListBlock,
  skill_list: SkillListBlock,
  experience: ExperienceBlock,
  contact: ContactBlock,
  link: LinkBlock,
};

// Renderiza un bloque "ui" devuelto por el backend/Gemini según su "type".
// Si el tipo no está registrado, no se rompe la conversación: simplemente no se pinta nada.
export default function UiBlock({ block }) {
  const Component = REGISTRY[block?.type];
  if (!Component) return null;
  return <Component data={block.data} />;
}
