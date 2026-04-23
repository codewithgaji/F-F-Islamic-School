import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Classes", to: "/classes" },
  { label: "Teachers", to: "/teachers" },
  { label: "Gallery", to: "/gallery" },
];

const pagesDropdown = [
  { label: "Blog Grid", to: "/blog" },
  { label: "Blog Detail", to: "/blog/1" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setPagesOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
    );

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur shadow-soft" : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-soft">
            <Star className="w-5 h-5" />
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-display font-bold text-base text-foreground">F&amp;F Islamic</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Super Kiddies Centre</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <div className="relative" onMouseEnter={() => setPagesOpen(true)} onMouseLeave={() => setPagesOpen(false)}>
            <button className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary flex items-center gap-1">
              Pages <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {pagesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 mt-1 min-w-[160px] rounded-md border border-border bg-popover shadow-card py-2"
                >
                  {pagesDropdown.map((p) => (
                    <Link key={p.to} to={p.to} className="block px-4 py-2 text-sm hover:bg-secondary text-popover-foreground">
                      {p.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden lg:block">
          <Button asChild className="rounded-full px-6">
            <Link to="/contact">Enroll Now</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
              {pagesDropdown.map((p) => (
                <NavLink key={p.to} to={p.to} className={linkClass}>
                  {p.label}
                </NavLink>
              ))}
              <NavLink to="/contact" className={linkClass}>
                Contact
              </NavLink>
              <Button asChild className="rounded-full mt-3 w-full">
                <Link to="/contact">Enroll Now</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};