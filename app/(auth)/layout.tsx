import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Logo />
        <span className="text-xl font-bold tracking-tight">Nimbus</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
        {children}
      </div>
    </div>
  );
}
