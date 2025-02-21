"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  Crown,
  Kanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { currentUser } from "@/app/data/mock-data";
import axios from "axios";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Kanban Board", path: "/dashboard/kanban", icon: Kanban },
  { name: "Calendar", path: "/dashboard/calendar", icon: Calendar },
  { name: "Milestones", path: "/dashboard/rewards", icon: Crown },
];

interface MainNavProps {
  showAuthButtons?: boolean;
}

interface UserDetails {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function MainNav({ showAuthButtons = false }: MainNavProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = pathname.includes("/dashboard");
  const [userInfo, setUserInfo] = useState<UserDetails>();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("task-token");
    localStorage.removeItem("task-refresh-token");
    router.push("/login");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("task-token");

    if (isLoggedIn && token) {
      // Ensure user is logged in and token exists
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/user/profile/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserInfo(response.data);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      };
      fetchUser();
    }
  }, [isLoggedIn]); // Add dependency to re-run if login status changes

  if (!isMounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-accent dark:bg-[#1F1F1F] dark:border-gray-700 dark:text-white">
      <div className="container flex h-16 items-center justify-between py-4 mx-auto">
        <div className="flex items-center gap-2">
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <span className="font-bold text-shuttle-gray whitespace-nowrap">
              Bachelor's LifeHub
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-12 w-full">
          {isLoggedIn ? (
            navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-all ${
                    isActive
                      ? "text-black border-b-2 border-black dark:text-[#959595] dark:border-[#959595]"
                      : "text-shuttle-gray hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })
          ) : (
            <></>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-shuttle-gray"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isLoggedIn ? (
            <>
              {/* <Button variant="ghost" size="icon" className="text-shuttle-gray hidden md:flex">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className="relative flex gap-2 items-center h-8 rounded-full bg-transparent px-2 text-lg font-medium text-shuttle-gray"
                  >
                    {/* <span className="font-semibold hidden sm:inline-block">{userInfo?.user?.first_name + ' ' + userInfo?.user?.last_name}</span> */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-950 dark:bg-[#959595] text-white">
                      {userInfo?.user?.first_name?.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {userInfo?.user?.first_name +
                          " " +
                          userInfo?.user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userInfo?.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <div
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : showAuthButtons ? (
            <div className="hidden md:flex md:items-center md:gap-2">
              <Button
                asChild
                variant="default"
                className="dark:bg-[#BB86FC] dark:text-white"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/login">Sign up</Link>
              </Button>
            </div>
          ) : null}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:w-72">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-shuttle-gray">
                    Bachelor's LifeHub
                  </span>
                  {/* <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button> */}
                </div>

                <nav className="flex flex-col gap-1">
                  {isLoggedIn ? (
                    navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md ${
                            isActive
                              ? "bg-muted text-black"
                              : "text-shuttle-gray hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })
                  ) : (
                    <>
                      <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md ${
                          pathname === "/"
                            ? "bg-muted text-black"
                            : "text-shuttle-gray hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        Home
                      </Link>
                      <Link
                        href="#features"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md ${
                          pathname === "#features"
                            ? "bg-muted text-black"
                            : "text-shuttle-gray hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        Features
                      </Link>
                      <Link
                        href="#testimonials"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md ${
                          pathname === "#testimonials"
                            ? "bg-muted text-black"
                            : "text-shuttle-gray hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        Testimonials
                      </Link>
                    </>
                  )}
                </nav>

                {!isLoggedIn && showAuthButtons && (
                  <div className="mt-6 flex flex-col gap-2">
                    <Button asChild variant="default">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="mt-auto pt-6 border-t">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-logan text-white">
                        {userInfo?.user?.first_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {userInfo?.user?.first_name +
                            " " +
                            userInfo?.user?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userInfo?.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-shuttle-gray hover:bg-muted"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-destructive hover:bg-muted text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
