"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Cloud,
  LogIn,
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
  Home,
} from "lucide-react";

function NavLink({
  href,
  label,
  active,
  icon: Icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors " +
        (active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60")
      }
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const { theme, setTheme } = useTheme();

  const isDark = (theme ?? "dark") === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Cloud className="h-5 w-5" />
            </span>
            <span className="font-semibold tracking-tight">
              Fidenz Analytics
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 ml-2">
            <NavLink
              href="/"
              label="Home"
              icon={Home}
              active={pathname === "/"}
            />
            <NavLink
              href="/dashboard"
              label="Dashboard"
              icon={LayoutDashboard}
              active={pathname?.startsWith("/dashboard") ?? false}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-foreground hover:bg-secondary/70 transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {isLoading ? (
            <div className="h-10 w-24 rounded-xl bg-secondary/50 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs text-muted-foreground max-w-48 truncate">
                {user.email ?? user.name ?? "Signed in"}
              </span>
              {/* Auth0 endpoints: use a normal full page navigation. */}
              <a
                href="/api/auth/logout"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-secondary/40 hover:bg-secondary/70 border border-border transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </a>
            </div>
          ) : (
            /* Auth0 endpoints: keep this as <a> (no client routing). */
            <a
              href="/api/auth/login?returnTo=%2Fdashboard"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
