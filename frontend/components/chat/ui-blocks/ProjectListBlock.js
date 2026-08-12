import ProjectCard from '@/components/projects/ProjectCard';

export default function ProjectListBlock({ data }) {
  const projects = data?.projects || [];
  if (projects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.slug || project._id} project={project} compact />
      ))}
    </div>
  );
}
