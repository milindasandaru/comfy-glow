import Navbar from "@/components/layout/Navbar";
import type { ReactNode } from "react";

export default function UnauthorizedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
