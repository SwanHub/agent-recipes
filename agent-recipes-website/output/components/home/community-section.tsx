import Link from "next/link";
import { UserProfilePreview } from "@/components/people/user-profile-preview";
import { SHELL_INNER_CLASS } from "@/lib/constants";
import type { Person } from "@/features/people/types";

type CommunitySectionProps = {
  people: Person[];
};

export function CommunitySection({ people }: CommunitySectionProps) {
  return (
    <section className={`${SHELL_INNER_CLASS} py-12 sm:py-16`}>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Community
          </h2>
          <p className="mt-2 text-muted">
            The creators publishing recipes on Agent Recipes.
          </p>
        </div>
        <Link
          href="/profiles/all"
          className="text-sm font-medium text-accent hover:underline"
        >
          View all profiles
        </Link>
      </div>

      {people.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <UserProfilePreview key={person.slug} person={person} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-muted">
          Community profiles will appear here as recipes are submitted.
        </p>
      )}
    </section>
  );
}
