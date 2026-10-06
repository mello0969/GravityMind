import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { GravityWidget } from "@/components/gravity-widget";
import { ObservabilityBridge } from "@/components/observability-bridge";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useAuth } from "@/lib/auth/use-auth";
import { BRAND_NAME } from "@/lib/brand";
import { captureClientError } from "@/lib/observability/client";
import { SiteSettingsProvider } from "@/lib/settings/use-site-settings";
import appCss from "../styles.css?url";

const INITIAL_PREFERENCES_SCRIPT =
  "try{var p='fisicafacil:',q='gravitymind:',a=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(p)===0)a.push(k)}for(var j=0;j<a.length;j++){var n=a[j].replace(p,q);if(localStorage.getItem(n)===null)localStorage.setItem(n,localStorage.getItem(a[j]))}var s=JSON.parse(localStorage.getItem(q+'settings')||'{}');var m=s.motion==='reduced'||(s.motion!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);document.documentElement.classList.toggle('dark',(s.theme!=='light'&&s.theme!=='system')||(s.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches));document.documentElement.dataset.motion=m?'reduced':'full';document.documentElement.dataset.reading=s.reading==='large'?'large':'standard';document.documentElement.dataset.cookieConsent=localStorage.getItem(q+'cookie-consent')||'unset'}catch(e){}";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm font-bold text-primary">ERRO 404</p>
      <h2 className="mt-4 text-2xl font-bold">Página não encontrada</h2>
      <p className="mt-2 text-sm text-muted-foreground">A página que você procura não existe.</p>
      <Link to="/" className="ff-btn-primary mt-8">
        Ir para o início
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  useEffect(() => {
    void captureClientError(error);
  }, [error]);
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 font-mono text-sm font-bold text-destructive">ERRO</p>
      <h1 className="text-xl font-bold">Algo deu errado</h1>
      <p className="mt-2 text-sm text-muted-foreground">Tente novamente ou volte ao início.</p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="ff-btn-primary"
        >
          Tentar novamente
        </button>
        <a href="/" className="ff-btn-outline">
          Início
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${BRAND_NAME} | Estudo ativo de Física` },
      {
        name: "description",
        content:
          "Plataforma de Física para ensino médio com estudo guiado, questões adaptativas e quadro de resolução.",
      },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#101c19" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
      },
      {
        rel: "preload",
        href: "/fonts/outfit-400.ttf",
        as: "font",
        type: "font/ttf",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
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
