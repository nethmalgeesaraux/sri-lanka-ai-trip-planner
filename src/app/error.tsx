"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f8fb] p-6 text-[#08233f]">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">
          Let’s get you back on your trail.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          We couldn’t load this page. Please try again, or sign out if your
          session has expired.
        </p>
        <button
          onClick={reset}
          className="mt-6 min-h-11 rounded-full bg-green-700 px-6 text-sm font-semibold text-white"
        >
          Try Again
        </button>
        <button
          onClick={async () => {
            await authClient.signOut().catch(() => {});
            router.push("/");
          }}
          className="mt-4 min-h-11 px-5 text-sm"
        >
          Sign Out & Return Home
        </button>
      </div>
    </main>
  );
}
