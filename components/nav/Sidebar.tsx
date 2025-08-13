"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const COFFEE = "#7B4B2A";

export default function SideBar({ role }: { role?: string }) {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Menu", icon: <ClocheIcon /> },
    {
      href: "/orders",
      label: "Orders",
      icon: <ClockIcon />,
      show: role === "barista",
    },
    { href: "/track", label: "Track", icon: <SearchIcon /> },
  ].filter((i) => i.show !== false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="hidden lg:block p-3">
      <div
        className="sticky top-3 flex h-[calc(100vh-1.5rem)] w-[84px] flex-col items-center justify-between
                      rounded-[24px] bg-white/90 shadow-sm ring-1 ring-black/5"
      >
        <div className="w-full px-3 pt-4">
          <div className="grid place-items-center">
            <div
              className="h-10 w-10 rounded-2xl grid place-items-center font-serif text-2xl"
              style={{ color: COFFEE, border: `1px solid ${COFFEE}20` }}
            >
              K
            </div>
          </div>

          <nav className="mt-6 flex flex-col items-center gap-4">
            {items.map((it) => {
              const active = isActive(it.href);
              return (
                <div key={it.href} className="flex flex-col items-center">
                  <Link
                    href={it.href}
                    className={`grid h-12 w-12 place-items-center rounded-2xl transition ${
                      active
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={{
                      backgroundColor: active ? COFFEE : "transparent",
                      boxShadow: active
                        ? "0 6px 14px rgba(107,63,42,0.25)"
                        : undefined,
                    }}
                    aria-current={active ? "page" : undefined}
                    title={it.label}
                  >
                    {it.icon}
                  </Link>
                  <span
                    className={`mt-1 text-[10px] ${
                      active ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {it.label}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

/* Icons */
function ClocheIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 18h16M6 18a6 6 0 1 1 12 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 6v-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8v5l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M17 17l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 17v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10 12h9m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
