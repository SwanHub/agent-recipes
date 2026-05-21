import { CommunitySection } from "@/components/home/community-section";
import { EmailSignupSection } from "@/components/home/email-signup-section";
import { FeaturedRecipesSection } from "@/components/home/featured-recipes-section";
import { LandingHero } from "@/components/home/landing-hero";
import { fetchFeaturedPeople } from "@/features/people/server";
import { fetchFeaturedRecipes } from "@/features/recipes/server";

export default async function Home() {
  const [recipes, people] = await Promise.all([
    fetchFeaturedRecipes(),
    fetchFeaturedPeople(),
  ]);

  return (
    <>
      <LandingHero />
      <FeaturedRecipesSection recipes={recipes} />
      <EmailSignupSection />
      <CommunitySection people={people} />
    </>
  );
}
