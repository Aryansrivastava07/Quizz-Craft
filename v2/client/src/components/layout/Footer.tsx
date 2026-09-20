import Link from "next/link";

export default function Footer() {
  const routes = [
    { label: "Create Quiz", href: "/create" },
    { label: "Review & Editor", href: "/editor" },
    { label: "Deploy Hub", href: "/deploy" },
    { label: "Join Arena", href: "/join" },
    { label: "Active Quiz", href: "/quiz" },
    { label: "Leaderboard", href: "/results" },
    { label: "Sign In", href: "/auth" },
  ];

  return (
    <footer className="w-full bg-surface-container-lowest/90 border-t border-outline-variant/30 relative z-10 backdrop-blur-md">
      <div className="max-w-max-width-canvas mx-auto px-gutter-desktop py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-sm">bolt</span>
            </div>
            <span className="font-headline-sm text-white font-bold">
              QuizzCraft<span className="text-tertiary">.app</span>
            </span>
          </Link>
          <span className="font-body-sm text-on-surface-variant text-xs text-center sm:text-left">
            © 2026 QuizzCraft.app. Interactive 3D Learning Platform.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-label-code text-on-surface-variant">
          {routes.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
