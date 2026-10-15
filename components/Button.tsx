import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20",
  secondary:
    "border border-black/10 bg-white text-gray-900 hover:bg-gray-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
  ghost: "text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10",
};

function cx(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  className,
  ...props
}: { variant?: Variant } & ComponentProps<"button">) {
  return <button className={cx(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link className={cx(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
