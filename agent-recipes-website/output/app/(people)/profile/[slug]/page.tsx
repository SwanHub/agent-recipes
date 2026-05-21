import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PreviewAvatar } from "@/components/people/preview-avatar";
import { ProfileRecipesSection } from "@/components/recipes/profile-recipes-section";
import { fetchPersonBySlug } from "@/features/people/server";
import { SHELL_INNER_CLASS } from "@/lib/constants";
import { formatWebsiteLabel } from "@/lib/format-website-label";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

function formatJoinedDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = await fetchPersonBySlug(slug);

  if (!person) {
    return { title: "Profile not found | Agent Recipes" };
  }

  return {
    title: `${person.name} | Agent Recipes`,
    description: person.bio ?? `Recipes and profile for ${person.name}.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const person = await fetchPersonBySlug(slug);

  if (!person) {
    notFound();
  }

  const links = [
    {
      href: person.githubUrl,
      label: "GitHub",
      icon: ExternalLink,
    },
    person.website
      ? {
          href: person.website.startsWith("http")
            ? person.website
            : `https://${person.website}`,
          label: formatWebsiteLabel(person.website),
          icon: ExternalLink,
        }
      : null,
    person.twitter
      ? {
          href: person.twitter,
          label: "Twitter",
          icon: ExternalLink,
        }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof ExternalLink;
  }>;

  return (
    <div className={`${SHELL_INNER_CLASS} flex flex-1 flex-col py-10 sm:py-14`}>
      <div className="flex flex-col gap-8 border-b border-border pb-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <PreviewAvatar
            name={person.name}
            avatarUrl={person.avatarUrl}
            size="lg"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium text-accent">Community profile</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {person.name}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Joined {formatJoinedDate(person.joinedAt)}
            </p>

            {person.bio ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                {person.bio}
              </p>
            ) : null}

            {links.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-3">
                {links.map((link) => {
                  const Icon = link.icon;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        <Icon className="size-4" aria-hidden />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <aside className="install-badge-slot shrink-0 rounded-2xl border border-border bg-footer-bg px-5 py-4 lg:min-w-40">
          <p className="text-sm font-medium text-muted">Recipes shared</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
            {person.recipeCount}
          </p>
        </aside>
      </div>

      <section className="mt-10">
        <ProfileRecipesSection person={person} />
      </section>
    </div>
  );
}
