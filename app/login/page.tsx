import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-secondary/30 backdrop-blur-xl p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with Auth0 to access the Comfort Index dashboard.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </Link>
          <a
            href="/api/auth/login?returnTo=%2Fdashboard"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-colors text-sm font-medium"
          >
            Login
          </a>
        </div>

        <div className="mt-4">
          <a
            href="/api/auth/logout"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </a>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          After login you will be redirected back to the page you requested.
        </p>
      </div>
    </div>
  );
}
