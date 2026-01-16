import { createRouter, createRoute, createRootRoute } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

// Layouts
import { RootLayout } from "@/components/layouts/root-layout";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

// Pages
import { HomePage } from "@/routes/home";
import { PrivacyPage } from "@/routes/privacy";
import { TermsPage } from "@/routes/terms";
import { DashboardPage } from "@/routes/dashboard/index";
import { SitesPage } from "@/routes/dashboard/sites";
import { UsagePage } from "@/routes/dashboard/usage";
import { BillingPage } from "@/routes/dashboard/billing";
import { SettingsPage } from "@/routes/dashboard/settings";
import { PlaygroundPage } from "@/routes/dashboard/playground";
import { VerificationDetailPage } from "@/routes/dashboard/verification";

export const queryClient = new QueryClient();

// Root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

// Dashboard layout route (handles auth internally)
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard-layout",
  component: DashboardLayout,
});

// Dashboard routes
const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const sitesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/sites",
  component: SitesPage,
});

const usageRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/usage",
  component: UsagePage,
});

const billingRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/billing",
  component: BillingPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/settings",
  component: SettingsPage,
});

const playgroundRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/playground",
  component: PlaygroundPage,
});

const verificationDetailRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/verification/$id",
  component: VerificationDetailPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  privacyRoute,
  termsRoute,
  dashboardLayoutRoute.addChildren([
    dashboardRoute,
    playgroundRoute,
    sitesRoute,
    usageRoute,
    billingRoute,
    settingsRoute,
    verificationDetailRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
