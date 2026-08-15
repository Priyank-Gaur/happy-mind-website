import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
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

import { Toaster as V2Sonner } from "@/v2/components/ui/sonner";
import { ContactUsWidget } from "@/v2/components/contact-us-widget";
import { GlobalBackgroundAudio } from "@/v2/components/global-background-audio";
import DashboardPage from "@/v2/pages/index";
import LoginPage from "@/v2/pages/login";
import SignupPage from "@/v2/pages/signup";
import JourneyPage from "@/v2/pages/journey";
import ProfilePage from "@/v2/pages/profile";
import AssessmentPage from "@/v2/pages/assessment";
import QuizzardPage from "@/v2/pages/quizzard";
import ExpertsPage from "@/v2/pages/experts";
import GamesPage from "@/v2/pages/games";
import ResourcesPage from "@/v2/pages/resources";
import ArticlesIndex from "@/v2/pages/articles-index";
import ArticlePage from "@/v2/pages/articles-slug";
import ServicesLayout from "@/v2/pages/services";
import ServicesPage from "@/v2/pages/services-index";
import SharedPricingPage from "@/v2/pages/services-slug";
import CartPage from "@/v2/pages/cart";
import CheckoutLayout from "@/v2/pages/checkout";
import SuccessPage from "@/v2/pages/checkout-success";
import SubscriptionPage from "@/v2/pages/subscription";
import SupportPage from "@/v2/pages/support";

const queryClient = new QueryClient();

function V2Layout() {
  return (
    <>
      <ContactUsWidget />
      <V2Sonner position="top-center" richColors />
      <GlobalBackgroundAudio />
      <Outlet />
    </>
  );
}

function GlobalChrome() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/v2")) return null;
  return (
    <>
      <Toaster />
      <Sonner />
      <FloatingContactButton />
      <MascotIntro />
      <WelcomeAudio />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <GlobalChrome />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/for-individuals" element={<ForIndividuals />} />
          <Route path="/for-organisations" element={<ForOrganisations />} />
          <Route path="/solv" element={<Solv />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/v2" element={<V2Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="journey" element={<JourneyPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="assessment" element={<AssessmentPage />} />
            <Route path="quizzard" element={<QuizzardPage />} />
            <Route path="experts" element={<ExpertsPage />} />
            <Route path="games" element={<GamesPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="articles" element={<ArticlesIndex />} />
            <Route path="articles/:slug" element={<ArticlePage />} />
            <Route path="services" element={<ServicesLayout />}>
              <Route index element={<ServicesPage />} />
              <Route path=":slug" element={<SharedPricingPage />} />
            </Route>
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutLayout />}>
              <Route path="success" element={<SuccessPage />} />
            </Route>
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="support" element={<SupportPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
