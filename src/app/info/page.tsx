import Link from "next/link";
import { ArrowLeft, CircleHelp } from "lucide-react";

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col justify-center">
        <Link
          href="/"
          className="mb-10 inline-flex h-9 w-fit items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>

        <div className="space-y-6">
          <div className="grid size-11 place-items-center rounded-md border border-zinc-200 bg-white shadow-sm">
            <CircleHelp className="size-5 text-zinc-700" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-medium tracking-tight text-zinc-950">
              Overstatement / Understatement
            </h1>
            <p className="text-sm leading-6 text-zinc-600">
              The two buttons on the main page are intentionally identical. The
              first overstates its consequence with excessive warnings, then
              only removes half of itself. The second understates its
              consequence by looking ordinary, then jumps straight to an
              operating-system failure screen.
            </p>
            <p className="text-sm leading-6 text-zinc-600">
              The blank white page keeps the setup visually neutral so the
              mismatch between appearance and behavior becomes the whole demo.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
