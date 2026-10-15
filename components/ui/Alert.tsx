import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

type Tone = "error" | "success" | "info";

const tones: Record<Tone, string> = {
  error: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  success:
    "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  info: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
};

/** Inline feedback message (form errors, confirmations). */
export function Alert({
  tone = "info",
  className,
  ...props
}: { tone?: Tone } & ComponentProps<"p">) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "rounded-lg px-3 py-2 text-sm",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
