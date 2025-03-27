
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";

// Create pages for our routes
import LoginForm from "./components/LoginForm";
import BloodRequestForm from "./components/BloodRequestForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <PageTransition>
                <Index />
              </PageTransition>
            } />
            <Route path="/find-blood" element={
              <PageTransition>
                <BloodRequestForm />
              </PageTransition>
            } />
            <Route path="/become-donor" element={
              <PageTransition>
                <LoginForm />
              </PageTransition>
            } />
            <Route path="/contact" element={
              <PageTransition>
                <Contact />
              </PageTransition>
            } />
            <Route path="/dashboard" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/login" element={
              <PageTransition>
                <LoginForm />
              </PageTransition>
            } />
            <Route path="/signup" element={
              <PageTransition>
                <LoginForm isSignUp={true} />
              </PageTransition>
            } />
            <Route path="/privacy" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
            <Route path="/terms" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
            <Route path="/data-protection" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
            <Route path="/cookie-policy" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
            <Route path="/faq" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
