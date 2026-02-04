import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-secondary/30 backdrop-blur-xl p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          UI placeholder. We can wire this to Auth0 next.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-medium"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
