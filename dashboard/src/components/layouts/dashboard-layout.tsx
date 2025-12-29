import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FlaskConical, Globe, BarChart3, CreditCard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

function MiraLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.947 3.28332L21.9761 0.884766L32.1155 15.958L28.4941 18.13V23.1536H27.7694L17.947 8.53343V3.28332Z" fill="currentColor"/>
      <path d="M9.393 7.7657L13.4221 5.36715L23.5615 20.4403L19.9401 22.6124V27.636H19.2153L9.393 13.0158V7.7657Z" fill="currentColor"/>
      <path d="M0.884277 12.2457L4.91335 9.84715L15.0528 24.9203L11.4314 27.0924V32.116H10.7066L0.884277 17.4958V12.2457Z" fill="currentColor"/>
    </svg>
  );
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/playground", label: "Playground", icon: FlaskConical },
  { href: "/dashboard/sites", label: "Sites", icon: Globe },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout() {
  const { data: session } = useSession();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2">
            <MiraLogo className="h-6 w-6" />
            <span className="text-lg font-semibold">Mira Verify</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 w-64 border-t p-4">
          <div className="mb-2 text-sm text-muted-foreground">
            {session?.user?.email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
