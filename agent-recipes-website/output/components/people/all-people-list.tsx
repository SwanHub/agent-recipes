"use client";

import { useMemo, useState } from "react";
import { UserProfilePreview } from "@/components/people/user-profile-preview";
import type { Person } from "@/features/people/types";

type AllPeopleListProps = {
  people: Person[];
};

function matchesQuery(person: Person, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const haystack = [person.name, person.bio ?? ""]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export function AllPeopleList({ people }: AllPeopleListProps) {
  const [query, setQuery] = useState("");

  const filteredPeople = useMemo(
    () => people.filter((person) => matchesQuery(person, query)),
    [people, query],
  );

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Search community</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or bio…"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
      </label>

      {filteredPeople.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <li key={person.slug}>
              <UserProfilePreview person={person} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          No people match your search.
        </p>
      )}
    </div>
  );
}
