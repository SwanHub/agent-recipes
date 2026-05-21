import Link from "next/link";

type SubmitRecipeButtonProps = {
  className?: string;
  size?: "default" | "small";
};

const baseClass =
  "inline-flex items-center justify-center rounded-full bg-accent font-medium text-white transition-opacity hover:opacity-90";

const sizeClass = {
  default: "px-4 py-2 text-sm",
  small: "px-3 py-1.5 text-xs",
};

export function SubmitRecipeButton({
  className = "",
  size = "default",
}: SubmitRecipeButtonProps) {
  return (
    <Link
      href="/recipes/submit"
      className={`${baseClass} ${sizeClass[size]} ${className}`.trim()}
    >
      Submit recipe
    </Link>
  );
}
