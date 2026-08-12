import Section from './Section';
import ProjectCard from '@/components/projects/ProjectCard';

export default function ProjectsBlock({ block }) {
  const projects = block.type === 'project' ? [block.data].filter(Boolean) : block.data?.projects || [];
  if (projects.length === 0) return null;

  const tag = projects[0]?.categories?.[0];

  return (
    <Section eyebrow={projects.length > 1 ? 'Proyectos destacados' : 'Proyecto'} tag={tag}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug || project._id} project={project} compact />
        ))}
      </div>
    </Section>
  );
}
