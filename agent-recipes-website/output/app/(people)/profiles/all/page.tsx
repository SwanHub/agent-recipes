import type { Metadata } from "next";
import { AllPeopleList } from "@/components/people/all-people-list";
import { fetchPeople } from "@/features/people/server";
import { SHELL_INNER_CLASS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Community | Agent Recipes",
  description: "Browse the creators sharing agent recipes on Agent Recipes.",
};

export default async function AllProfilesPage() {
  const people = await fetchPeople();

  return (
    <div className={`${SHELL_INNER_CLASS} flex flex-1 flex-col py-10 sm:py-14`}>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Community
        </h1>
        <p className="mt-3 text-lg text-muted">
          Meet the people building and sharing agent recipes.
        </p>
      </div>

      <div className="mt-10">
        <AllPeopleList people={people} />
      </div>
    </div>
  );
}
