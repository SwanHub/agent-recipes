import Link from "next/link";
import { PreviewAvatar } from "@/components/people/preview-avatar";
import type { Person } from "@/features/people/types";

type UserProfilePreviewProps = {
  person: Person;
};

function recipeSummary(count: number): string {
  if (count === 1) {
    return "1 recipe";
  }

  return `${count} recipes`;
}

export function UserProfilePreview({ person }: UserProfilePreviewProps) {
  return (
    <Link
      href={`/profile/${person.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-background p-5 transition-colors hover:border-accent/40 hover:bg-background/80"
    >
      <div className="flex items-start gap-4">
        <PreviewAvatar
          name={person.name}
          avatarUrl={person.avatarUrl}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
            {person.name}
          </h2>
          <p className="mt-1 text-sm text-muted">{recipeSummary(person.recipeCount)}</p>
        </div>
      </div>

      {person.bio ? (
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">
          {person.bio}
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted/70">No bio yet.</p>
      )}
    </Link>
  );
}
