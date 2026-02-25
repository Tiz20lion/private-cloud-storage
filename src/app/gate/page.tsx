import { ShieldIcon, CloudIcon, LockIcon, ServerIcon, DatabaseIcon, HardDriveIcon } from "lucide-react";

export default function GatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold tracking-tight">PrivateCloud</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Systems Online
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-border bg-secondary">
            <ShieldIcon className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Private Cloud Storage
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              This is a private cloud storage instance. To access, append your secret key to the URL.
            </p>
          </div>

          {/* Info card */}
          <div className="border border-border rounded-xl bg-card p-6 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <LockIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Access Required</span>
            </div>
            <p className="text-sm text-muted-foreground font-mono leading-relaxed">
              Add <span className="text-foreground">?key=YOUR_SECRET</span> to the URL to authenticate your session.
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: ServerIcon, label: "End-to-End Encrypted" },
              { icon: DatabaseIcon, label: "Cloud Metadata" },
              { icon: HardDriveIcon, label: "S3 Object Storage" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary text-xs text-muted-foreground"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono">Secured Access Only</span>
        <span className="font-mono opacity-50">v1.0</span>
      </footer>
    </div>
  );
}
