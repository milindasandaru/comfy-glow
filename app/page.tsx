import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background selection:bg-primary/20">
      {/** Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/** Main content */}
      <div className="z-10 w-full max-w-4xl px-6 text-center space-y-8">
        {/** Logo Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-white/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-8 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            System Operational
          </span>
        </div>

        {/** Hero text */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50">
            Fidenz Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced environmental monitoring system powered by the
            <span className="text-primary font-semibold">
              {" "}
              SSI Comfort Algorithm
            </span>
            .
          </p>
        </div>

        {/** Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <FeatureCard
            icon={Zap}
            title="Real-time Analysis"
            desc="Live weather data processing with < 50ms latency."
          />
          <FeatureCard
            icon={Globe}
            title="Global Coverage"
            desc="Monitoring 200,000+ cities with precision accuracy."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Enterprise Security"
            desc="Protected by Auth0 MFA and Role-Based Access."
          />
        </div>

        {/** Get Started Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          {/* THE LOGIN BUTTON (We will wire this to Auth0 later) */}
          <a
            href="/api/auth/login?returnTo=%2Fdashboard"
            className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/25"
          >
            Login with Fidenz
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-xs text-muted-foreground">
        <p>© 2026 Fidenz Technologies Assignment. Built by Sams Senarath.</p>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors text-left">
      <Icon className="h-8 w-8 text-primary mb-4" />
      <h3 className="font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
