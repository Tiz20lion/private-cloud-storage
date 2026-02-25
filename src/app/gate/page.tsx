import {
  CloudIcon,
  UploadCloudIcon,
  FolderTreeIcon,
  SmartphoneIcon,
  HardDriveIcon,
  GitForkIcon,
  ServerIcon,
  KeyRoundIcon,
  RocketIcon,
  GithubIcon,
  ExternalLinkIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  LayoutGridIcon,
} from "lucide-react";

const GITHUB_URL = "https://github.com/Tiz20lion/private-cloud-storage";

const features = [
  { icon: UploadCloudIcon, title: "Direct S3 Upload", desc: "Upload any file type with presigned URLs straight to your S3 bucket" },
  { icon: FolderTreeIcon, title: "Nested Folders", desc: "Organize files in folders just like a regular file system" },
  { icon: LayoutGridIcon, title: "Grid & List View", desc: "Switch between grid and list layouts to browse your files" },
  { icon: SmartphoneIcon, title: "Mobile First", desc: "Built for phones first, works perfectly on desktop too" },
  { icon: ShieldCheckIcon, title: "Password Protected", desc: "Single password login with JWT sessions to keep your files private" },
  { icon: HardDriveIcon, title: "Storage Stats", desc: "Track upload progress and see how much storage you are using" },
];

const steps = [
  {
    num: "01",
    icon: GitForkIcon,
    title: "Fork the Repository",
    desc: "Fork the project on GitHub to get your own copy of the codebase.",
    detail: "Click the Fork button on the repo page, then clone it to your machine.",
  },
  {
    num: "02",
    icon: KeyRoundIcon,
    title: "Get Your AWS Keys",
    desc: "Create an S3 bucket and an IAM user with S3 access permissions.",
    detail: "You need an access key, secret key, bucket name, and region (e.g. us-east-1).",
  },
  {
    num: "03",
    icon: DatabaseIcon,
    title: "Set Up MongoDB Atlas",
    desc: "Create a free MongoDB Atlas cluster to store your file metadata.",
    detail: "Get your connection string from the Atlas dashboard.",
  },
  {
    num: "04",
    icon: RocketIcon,
    title: "Deploy to Vercel",
    desc: "Import your forked repo into Vercel and add your environment variables.",
    detail: "Vercel auto-detects Next.js. Add your env vars in project settings and deploy.",
  },
];

export default function GatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight">PrivateCloud</span>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border
                       text-sm text-muted-foreground hover:text-foreground hover:border-primary/50
                       transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground font-mono">
              <ServerIcon className="w-3 h-3" />
              Open Source / Self Hosted
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Your Files, Your Server,<br />
              <span className="text-primary">Your Cloud</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
              A personal cloud storage app you host yourself. Upload from your phone, keep files
              in folders, and download them from anywhere.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground
                           font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                View on GitHub
              </a>
              <a
                href="#setup"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border
                           text-sm text-muted-foreground hover:text-foreground hover:border-primary/50
                           transition-colors"
              >
                How to Set Up
              </a>
            </div>
          </div>
        </section>

        {/* Tech stack bar */}
        <section className="border-y border-border py-6 px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3
                          text-xs text-muted-foreground font-mono">
            {["Next.js 16", "TypeScript", "AWS S3", "MongoDB Atlas", "Tailwind CSS", "Vercel"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary" />
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Everything You Need</h2>
              <p className="text-muted-foreground mt-2">Simple, fast, and fully under your control.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-center">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="border border-border rounded-xl bg-card p-4 sm:p-5
                             hover:border-primary/30 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary mb-3">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm">{title}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mt-1.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Setup steps */}
        <section id="setup" className="px-4 py-16 sm:py-20 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Set Up in 4 Steps</h2>
              <p className="text-muted-foreground mt-2">Fork, configure, deploy. Takes about 15 minutes.</p>
            </div>
            <div className="space-y-4">
              {steps.map(({ num, icon: Icon, title, desc, detail }) => (
                <div
                  key={num}
                  className="border border-border rounded-xl bg-card p-5 flex gap-5 items-start
                             hover:border-primary/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-primary">{num}</span>
                      <h3 className="font-semibold text-sm">{title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                    <p className="text-xs text-muted-foreground/70 font-mono">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA after steps */}
            <div className="mt-10 text-center">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground
                           font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <GitForkIcon className="w-4 h-4" />
                Fork on GitHub
                <ExternalLinkIcon className="w-3.5 h-3.5 opacity-60" />
              </a>
              <p className="text-xs text-muted-foreground mt-3 font-mono">
                Full setup instructions in the README
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3
                        text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CloudIcon className="w-3.5 h-3.5" />
            <span>Private Cloud Storage</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Source Code
            </a>
            <span className="font-mono opacity-50">v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
