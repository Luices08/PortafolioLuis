import ProjectCard from '@/components/projects/ProjectCard';

export default function ProjectBlock({ data }) {
  if (!data) return null;
  return (
    <div className="max-w-sm">
      <ProjectCard project={data} />
    </div>
  );
}
