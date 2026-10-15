import type { Metadata } from "next";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Card,
  Field,
  Input,
  Select,
  StatCard,
  Textarea,
} from "@/components/ui";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Components",
  description: "The Nimbus design system — shared UI primitives.",
  robots: { index: false, follow: false },
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function ComponentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-bold tracking-tight">Nimbus</span>
        </Link>
        <ButtonLink href="/" variant="ghost">
          ← Back home
        </ButtonLink>
      </header>

      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Design system</h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
          The shared UI primitives used across Nimbus, exported from{" "}
          <code className="rounded bg-black/5 px-1 py-0.5 text-sm dark:bg-white/10">
            @/components/ui
          </code>
          . Every surface in the app is built from these, so they stay
          consistent in light and dark mode.
        </p>
      </div>

      <div className="space-y-14">
        <Section
          title="Buttons"
          description="Three variants, plus a link-styled button for navigation."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
            <ButtonLink href="/components">Button link</ButtonLink>
          </div>
        </Section>

        <Section
          title="Badges"
          description="Status pills with semantic tones."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Neutral</Badge>
            <Badge tone="brand">Brand</Badge>
            <Badge tone="success">Active</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger">Error</Badge>
          </div>
        </Section>

        <Section
          title="Alerts"
          description="Inline feedback for forms and actions."
        >
          <div className="max-w-md space-y-3">
            <Alert tone="info">Heads up — this is an informational message.</Alert>
            <Alert tone="success">Your changes were saved.</Alert>
            <Alert tone="error">Invalid email or password.</Alert>
          </div>
        </Section>

        <Section
          title="Form controls"
          description="Labelled fields wrapping accessible inputs."
        >
          <Card className="max-w-md space-y-4">
            <Field id="demo-name" label="Full name">
              <Input id="demo-name" placeholder="Ada Lovelace" />
            </Field>
            <Field
              id="demo-role"
              label="Role"
              hint="Choose the access level for this member."
            >
              <Select id="demo-role" defaultValue="member">
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </Select>
            </Field>
            <Field id="demo-bio" label="Bio">
              <Textarea id="demo-bio" rows={3} placeholder="A short bio…" />
            </Field>
            <Field id="demo-disabled" label="Email" hint="Cannot be changed.">
              <Input id="demo-disabled" value="you@company.com" disabled readOnly />
            </Field>
          </Card>
        </Section>

        <Section
          title="Cards & stats"
          description="Surfaces for grouping content and metrics."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Active projects" value="12" sub="+2 this week" />
            <StatCard label="API requests" value="48.2k" sub="+18% vs last month" />
            <StatCard label="Storage used" value="64 GB" sub="of 100 GB" />
          </div>
          <Card>
            <h3 className="font-semibold">Card</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              A generic surface container with configurable padding.
            </p>
          </Card>
        </Section>
      </div>
    </main>
  );
}
