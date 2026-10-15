import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral:
    "bg-black/5 text-gray-700 dark:bg-white/10 dark:text-gray-300",
  brand:
    "border border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300",
  success:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

/** Small status pill. */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: { tone?: Tone } & ComponentProps<"span">) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
