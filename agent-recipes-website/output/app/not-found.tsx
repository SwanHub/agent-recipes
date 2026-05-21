import Link from "next/link";
import { SHELL_INNER_CLASS } from "@/lib/constants";

export default function NotFound() {
  return (
    <div
      className={`${SHELL_INNER_CLASS} flex flex-1 flex-col items-center justify-center py-24 text-center`}
    >
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
