import Link from "next/link";
import { ButtonLink } from "./Button";
import { Logo } from "./Logo";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-bold tracking-tight">Nimbus</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex dark:text-gray-300">
          <a href="#features" className="hover:text-brand-600">
            Features
          </a>
          <a href="#pricing" className="hover:text-brand-600">
            Pricing
          </a>
          <a href="#faq" className="hover:text-brand-600">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {signedIn ? (
            <ButtonLink href="/dashboard">Dashboard</ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" className="hidden sm:inline-flex">
                Log in
              </ButtonLink>
              <ButtonLink href="/signup">Get started</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
