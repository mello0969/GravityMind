import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import { GravityWidget } from "@/components/gravity-widget";

import { ObservabilityBridge } from "@/components/observability-bridge";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";

import { useAuth } from "@/lib/auth/use-auth";

import { INITIAL_PREFERENCES_SCRIPT } from "@/lib/settings/initial-preferences";

import { SiteSettingsProvider } from "@/lib/settings/use-site-settings";

export function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script>{INITIAL_PREFERENCES_SCRIPT}</script>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export function AppShell({ queryClient }: { queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <ObservabilityBridge />
        <div className="flex min-h-screen flex-col">
          <a href="#main-content" className="skip-link">
            Pular para o conteúdo
          </a>
          <SiteHeader />
          <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
            <AccountContent />
          </div>
          <SiteFooter />
          <GravityWidget />
        </div>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}

function AccountContent() {
  const { usuario, carregando } = useAuth();
  if (carregando)
    return (
      <div role="status" aria-label="Carregando estudo" className="gm-shell space-y-6 py-12">
        <div className="ff-skeleton h-10 w-64" />
        <div className="ff-skeleton h-5 w-2/3" />
        <div className="ff-skeleton h-72 w-full" />
      </div>
    );
  return <Outlet key={usuario?.id ?? "guest"} />;
}
