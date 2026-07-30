import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAdmin } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SEOHead } from "@/components/SEOHead";


import { LiveChat } from "@/components/LiveChat";
import Index from "./pages/Index";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Services from "./pages/Services";
import Experience from "./pages/Experience";
import Testimonials from "./pages/Testimonials";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminPages from "./pages/admin/AdminPages";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminServices from "./pages/admin/AdminServices";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSeo from "./pages/admin/AdminSeo";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <SEOHead />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Index /><LiveChat /></>} />
            <Route path="/about" element={<><About /><LiveChat /></>} />
            <Route path="/portfolio" element={<><Portfolio /><LiveChat /></>} />
            <Route path="/portfolio/:slug" element={<><ProjectDetail /><LiveChat /></>} />
            <Route path="/services" element={<><Services /><LiveChat /></>} />
            <Route path="/experience" element={<><Experience /><LiveChat /></>} />
            <Route path="/testimonials" element={<><Testimonials /><LiveChat /></>} />
            <Route path="/blog" element={<><Blog /><LiveChat /></>} />
            <Route path="/blog/:slug" element={<><BlogPost /><LiveChat /></>} />
            <Route path="/contact" element={<><Contact /><LiveChat /></>} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="seo" element={<AdminSeo />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
