import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Start building with Nimbus — no credit card required.
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
