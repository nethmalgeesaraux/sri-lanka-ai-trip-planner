import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-8 py-16 text-center text-[#08233f]">
      <h1 className="text-3xl font-semibold tracking-tight">Page Not Found</h1>
      <p className="mt-4 text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-[#087b35] to-[#007b75] px-6 text-sm font-bold text-white"
        href="/"
      >
        &larr; Back to Home
      </Link>
    </main>
  );
}
