export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-lg bg-brand-600 text-white ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.98A6 6 0 0 0 6.34 9.5 4 4 0 0 0 7 17.5" />
        <path d="M12 12v6" />
        <path d="m9 15 3-3 3 3" />
      </svg>
    </span>
  );
}
