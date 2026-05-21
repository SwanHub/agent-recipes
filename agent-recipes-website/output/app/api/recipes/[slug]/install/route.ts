import { incrementRecipeInstallCount } from "@/features/recipes/server";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    await incrementRecipeInstallCount(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "install_failed" }, { status: 500 });
  }
}
