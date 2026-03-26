"use client";

import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { AnimatedThemeToggler } from "./animated-theme-toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export default function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // @ts-expect-error custom user type
  const userRole = session?.user?.role;

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleClick = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["beranda", "fitur", "interaktif"];
      let current = "beranda";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold based on layout (e.g. 200px from top)
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navLinks = [
    { id: "beranda", href: "/#beranda", label: "Beranda" },
    { id: "fitur", href: "/#fitur", label: "Fitur" },
    { id: "interaktif", href: "/#interaktif", label: "Interaktif" },
  ];

  return (
    <nav className="w-full relative z-50 bg-transparent transition-colors">
      <div className="px-4 md:px-12 lg:px-24">
        <div className="flex items-center justify-between py-4 sm:py-6">
          {/* Logo / Brand */}
          <Link href="/">
            <h2 className="text-2xl font-medium text-black dark:text-white cursor-pointer hover:opacity-80 transition-opacity">
              SmartSeum
            </h2>
          </Link>

          {/* Desktop Navigation (Pill) */}
          <div className="hidden md:flex items-center gap-1 px-1.5 py-1.5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-gray-100 dark:border-white/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] rounded-full transition-colors z-20">
            {navLinks.map((link) => (
              <Link key={link.id} href={link.href}>
                <button
                  className={`px-5 py-2 text-[13px] transition-colors rounded-full ${
                    activeSection === link.id
                      ? "font-semibold bg-black text-white dark:bg-white dark:text-black shadow-md"
                      : "font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              </Link>
            ))}
          </div>

          {/* Right Side: Theme & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 z-20">
            {/* Theme toggler */}
            <AnimatedThemeToggler />

            <Link href={"/scan"}>
              <button className="hidden sm:flex px-5 py-2 text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors rounded-full shadow-lg shadow-emerald-500/20">
                Scan AR
              </button>
            </Link>

            {status === "loading" ? (
              <div className="w-10 h-10 rounded-full animate-pulse bg-black/10 dark:bg-white/10" />
            ) : status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button
                    className="w-10 h-10 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center select-none overflow-hidden border-2 border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all shadow-md"
                    title="Ke Dashboard"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 mt-2 p-1 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="font-normal px-3 py-2.5">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-black dark:text-white leading-none">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-emerald-400/80 font-mono truncate">
                        {session.user?.email || "No email"}
                      </p>
                      {userRole && (
                        <p className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          Role: {userRole}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10 mx-1" />

                  {(userRole === "admin" || userRole === "uploader") && (
                    <DropdownMenuGroup className="p-1">
                      <Link href={"/admin/dashboard"}>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl data-[highlighted]:bg-emerald-50 dark:data-[highlighted]:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 transition-colors group outline-none">
                          <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-sm">
                            Dashboard Admin
                          </span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                  )}

                  <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10 mx-1" />

                  <div className="p-1">
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl data-[highlighted]:bg-red-50 dark:data-[highlighted]:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors group outline-none"
                    >
                      <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      <span className="font-semibold text-sm">Keluar Akun</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={"/login"}>
                <button className="px-5 py-2 text-[13px] font-semibold text-black dark:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors rounded-full border border-black/10 dark:border-white/10">
                  Masuk
                </button>
              </Link>
            )}

            {/* Mobile Navigation Toggle */}
            <button
              onClick={handleClick}
              className="md:hidden p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isActive}
            >
              {isActive ? (
                <X className="w-6 h-6 text-black dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-black dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (Dropdown) */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-300 origin-top overflow-hidden z-20 ${
          isActive ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setIsActive(false)}
            >
              <button
                className={`w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  activeSection === link.id
                    ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-300 dark:hover:bg-gray-900/50 dark:hover:text-white"
                }`}
              >
                {link.label}
              </button>
            </Link>
          ))}

          <div className="h-px bg-gray-200 dark:bg-gray-800 w-full my-1"></div>

          <Link href={"/scan"} onClick={() => setIsActive(false)}>
            <button className="w-full text-center px-4 py-3 text-base font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
              Scan AR Experience
            </button>
          </Link>

          {status === "authenticated" ? (
            <Link href={"/admin/dashboard"} onClick={() => setIsActive(false)}>
              <button className="w-full text-center flex items-center justify-center gap-2 px-4 py-3 text-base font-medium rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors mt-1">
                Dashboard Control
              </button>
            </Link>
          ) : (
            <Link href={"/login"} onClick={() => setIsActive(false)}>
              <button className="w-full text-center px-4 py-3 text-base font-medium rounded-lg text-black dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 mt-1">
                Masuk Akun
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
