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
  { name: "Rewards", path: "/dashboard/rewards", icon: Crown },
];

interface UserDetails {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserDetails>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("task-token");
    localStorage.removeItem("task-refresh-token");
    router.push("/");
  };

  useEffect(() => {
    if (typeof window === undefined) return;
    const fetchUser = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/user/profile/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );
      setUserInfo(response.data);
    };
    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-64 p-0">
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-logan" />
                  <span className="font-bold text-shuttle-gray">
                    Bachelor's LifeHub
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="grid gap-2 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                        isActive
                          ? "bg-logan/10 text-logan"
                          : "text-shuttle-gray hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-logan" />
            <span className="font-bold text-shuttle-gray hidden md:block">
              Bachelor's LifeHub
            </span>
          </Link>
          <nav className="hidden md:flex md:gap-6 ml-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isActive
                      ? "text-logan"
                      : "text-shuttle-gray hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-shuttle-gray">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="relative flex gap-2 items-center h-8 rounded-full bg-muted px-2 text-sm font-medium text-shuttle-gray"
              >
                <span className="font-semibold">
                  {userInfo?.user?.first_name}
                </span>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-950 text-white">
                  {userInfo?.user?.first_name.charAt(0)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userInfo?.user?.first_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.email}
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
        </div>
      </div>
    </header>
  );
}
