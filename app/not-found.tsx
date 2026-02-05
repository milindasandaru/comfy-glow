import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-secondary/30 backdrop-blur-xl p-8">
        <p className="text-xs text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist, or it may have moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors text-sm font-medium"
          >
            Open dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
