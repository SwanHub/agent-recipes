import { fetchFeaturedRecipes } from "@/features/recipes/server";
import { NextResponse } from "next/server";

export async function GET() {
  const recipes = await fetchFeaturedRecipes();

  return NextResponse.json(recipes);
}
