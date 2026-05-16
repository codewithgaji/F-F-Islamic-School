import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, Image as ImageIcon, Settings, GraduationCap, Users, Camera, Sparkles, MessageSquareQuote, FileText, Mail, CalendarCheck, BookOpen, Send, LogOut, Menu, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/hero-slides", label: "Hero Slides", icon: ImageIcon },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/classes", label: "Classes", icon: GraduationCap },
  { to: "/admin/teachers", label: "Teachers", icon: Users },
  { to: "/admin/gallery", label: "Gallery", icon: Camera },
  { to: "/admin/facilities", label: "Facilities", icon: Sparkles },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/about", label: "About", icon: FileText },
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/newsletter", label: "Newsletter", icon: Send },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
  () => localStorage.getItem("admin_token")
);

  if (!token) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-secondary">
      <aside className={cn("fixed lg:static inset-y-0 left-0 z-40 w-64 bg-footer text-footer-foreground transform transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="h-16 px-5 flex items-center gap-2 border-b border-footer-foreground/10">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-primary text-primary-foreground"><Star className="w-4 h-4" /></span>
          <span className="font-display font-bold">F&amp;F Admin</span>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-footer-foreground/80 hover:bg-footer-foreground/10"
              )}
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6">
          <button className="lg:hidden p-2" onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
          </button>
          <h1 className="text-base font-display font-semibold text-foreground">Admin Panel</h1>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};