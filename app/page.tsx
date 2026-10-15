import { ButtonLink } from "@/components/Button";
import { SiteHeader } from "@/components/SiteHeader";
import { getCurrentUser } from "@/lib/session";

const features = [
  {
    title: "Auth built in",
    body: "Email + password sign-up and login backed by signed, httpOnly session cookies and scrypt-hashed passwords.",
    icon: "🔐",
  },
  {
    title: "Protected dashboard",
    body: "Server-verified sessions and edge middleware keep private routes private, with a clean app shell to build on.",
    icon: "🧭",
  },
  {
    title: "API routes",
    body: "Typed Next.js route handlers for auth and billing — swap the in-memory store for your database when ready.",
    icon: "⚡",
  },
  {
    title: "Billing-ready",
    body: "Plan management wired end-to-end with a drop-in point for Stripe Checkout and webhooks.",
    icon: "💳",
  },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["Up to 3 projects", "Community support", "1 GB storage"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: ["Unlimited projects", "Priority support", "100 GB storage", "Analytics"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["SSO & SAML", "Dedicated support", "Unlimited storage", "SLA"],
    cta: "Contact sales",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "What's included in this starter?",
    a: "A Next.js App Router project with TypeScript, Tailwind, email/password auth, a protected dashboard, and API routes — ready to extend.",
  },
  {
    q: "How is data stored?",
    a: "Out of the box it uses an in-memory store so you can run it instantly. Replace lib/db.ts with Prisma, Drizzle, or any database.",
  },
  {
    q: "Can I use a real payment provider?",
    a: "Yes. The billing API route is structured so you can drop in Stripe Checkout and update plans from a webhook.",
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader signedIn={Boolean(user)} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.18), transparent 70%)",
            }}
          />
          <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
              Next.js 15 · TypeScript · Tailwind
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Ship your SaaS{" "}
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                in days, not months
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Nimbus is a production-minded starter with authentication, a
              protected dashboard, and API routes — so you can focus on the
              product, not the plumbing.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={user ? "/dashboard" : "/signup"} className="px-6 py-3 text-base">
                {user ? "Go to dashboard" : "Get started free"}
              </ButtonLink>
              <ButtonLink href="#features" variant="secondary" className="px-6 py-3 text-base">
                See features
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Try the demo login — <span className="font-medium">demo@acme.com</span> /{" "}
              <span className="font-medium">password123</span>
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need to launch</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              The boring-but-essential parts, done well, so your first commit can be a feature.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Start free. Upgrade when you grow.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative rounded-2xl border p-8 ${
                  t.highlighted
                    ? "border-brand-500 bg-white shadow-lg shadow-brand-600/10 dark:bg-white/5"
                    : "border-black/5 bg-white dark:border-white/10 dark:bg-white/5"
                }`}
              >
                {t.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{t.price}</span>
                  <span className="text-gray-500">{t.period}</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  {t.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <span className="text-brand-600">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">{feat}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href="/signup"
                  variant={t.highlighted ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {t.cta}
                </ButtonLink>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {item.q}
                  <span className="text-brand-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500 sm:px-6">
          © {new Date().getFullYear()} Nimbus. Built with Next.js, TypeScript & Tailwind.
        </div>
      </footer>
    </div>
  );
}
