import Image from "next/image";
import Link from "next/link";

type AgentRecipesWebsiteMarkProps = {
  className?: string;
};

export function AgentRecipesWebsiteMark({
  className = "",
}: AgentRecipesWebsiteMarkProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80 ${className}`}
    >
      <Image
        src="/CUBE_2D_LIGHT.svg"
        alt=""
        width={28}
        height={32}
        className="h-7 w-auto dark:invert"
        priority
      />
      <span className="text-sm font-semibold tracking-tight sm:text-base">
        Agent Recipes
      </span>
    </Link>
  );
}
