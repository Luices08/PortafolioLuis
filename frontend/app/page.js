import HomeExperience from '@/components/home/HomeExperience';
import { getProfile, getFeaturedProjects, getProjectCategories } from '@/lib/data';

export default async function HomePage() {
  const [profile, featuredProjects, categorySeeds] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getProjectCategories(),
  ]);

  return (
    <HomeExperience profile={profile} featuredProjects={featuredProjects} categorySeeds={categorySeeds} />
  );
}
