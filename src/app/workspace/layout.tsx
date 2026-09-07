import Link from "next/link";
import type { ReactNode } from "react";

type WorkspaceLayoutProps = {
  children: ReactNode;
};

const navigation = [
  {
    label: "Overview",
    href: "/workspace",
  },
  {
    label: "Audience",
    href: "/workspace/audience",
  },
  {
    label: "Opportunities",
    href: "/workspace/opportunities",
  },
  {
    label: "Create",
    href: "/workspace/create",
  },
  {
    label: "Insights",
    href: "/workspace/insights",
  },
];

export default function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-zinc-200 px-6 py-5">
            <Link
              href="/workspace"
              className="text-lg font-semibold tracking-tight"
            >
              ContentPulse
            </Link>

            <p className="mt-1 text-xs text-zinc-500">
              Audience intelligence
            </p>
          </div>

          <nav className="flex-1 px-3 py-5">
            <p className="px-3 pb-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
              Workspace
            </p>

            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-zinc-200 px-6 py-5">
            <p className="text-xs text-zinc-400">
              AI Audience-to-Content Engine
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-zinc-200 bg-white lg:hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <Link
                href="/workspace"
                className="text-base font-semibold tracking-tight"
              >
                ContentPulse
              </Link>
            </div>

            <nav className="overflow-x-auto border-t border-zinc-100 px-4 py-2">
              <div className="flex min-w-max gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
