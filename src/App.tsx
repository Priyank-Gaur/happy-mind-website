import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ForIndividuals from "./pages/ForIndividuals";
import ForOrganisations from "./pages/ForOrganisations";
import Solv from "./pages/Solv";
import About from "./pages/About";
import FloatingContactButton from "./components/FloatingContactButton";
import ScrollToTop from "./components/ScrollToTop";
import MascotIntro from "./components/MascotIntro";
import WelcomeAudio from "./components/WelcomeAudio";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FloatingContactButton />
      <MascotIntro />
      <WelcomeAudio />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/for-individuals" element={<ForIndividuals />} />
          <Route path="/for-organisations" element={<ForOrganisations />} />
          <Route path="/solv" element={<Solv />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
