import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-secondary/30 backdrop-blur-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-sm text-muted-foreground">
          Your account is not allowed to access the dashboard.
        </p>

        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to home
          </Link>
          <a
            href="/api/auth/logout"
            className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-medium"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}
