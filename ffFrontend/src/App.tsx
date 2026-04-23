import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { PublicLayout } from "@/components/layout/PublicLayout";
import About from "@/pages/public/About";
import Classes from "@/pages/public/Classes";
import Teachers from "@/pages/public/Teachers";
import Gallery from "@/pages/public/Gallery";
import Blog from "@/pages/public/Blog";
import BlogDetail from "@/pages/public/BlogDetail";
import Contact from "@/pages/public/Contact";
import AdminLogin from "@/pages/admin/Login";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import {
  AdminHero, AdminClasses, AdminTeachers, AdminFacilities, AdminTestimonials,
  AdminGallery, AdminBlog, AdminAbout, AdminSettings, AdminMessages, AdminBookings, AdminNewsletter,
} from "@/pages/admin/AdminPages";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hero-slides" element={<AdminHero />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="facilities" element={<AdminFacilities />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
