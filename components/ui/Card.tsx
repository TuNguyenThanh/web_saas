import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

const cardBase =
  "rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5";

type Padding = "none" | "sm" | "md" | "lg";
const paddings: Record<Padding, string> = {
  none: "",
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

/** Surface container used across the dashboard. */
export function Card({
  padding = "md",
  className,
  ...props
}: { padding?: Padding } & ComponentProps<"div">) {
  return <div className={cx(cardBase, paddings[padding], className)} {...props} />;
}

/**
 * A card with a standard header (title + optional description), followed by its
 * body. Matches the "section" blocks used on the settings/overview pages.
 */
export function SectionCard({
  title,
  description,
  tone = "default",
  className,
  children,
}: {
  title: string;
  description?: ReactNode;
  tone?: "default" | "danger";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className={cx(
        cardBase,
        "p-6",
        tone === "danger" && "border-red-200 dark:border-red-500/20",
        className,
      )}
    >
      <h2
        className={cx(
          "text-lg font-semibold",
          tone === "danger" && "text-red-600 dark:text-red-400",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}

/** Compact stat tile (label / value / sub-text). */
export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Card padding="sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {sub ? <p className="mt-1 text-xs text-gray-500">{sub}</p> : null}
    </Card>
  );
}
