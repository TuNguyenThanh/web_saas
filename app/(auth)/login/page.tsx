import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Log in to your Nimbus account.
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}
