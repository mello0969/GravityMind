import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext } from "@tanstack/react-router";

import { AppShell, RootShell } from "@/components/app-shell";

import { ErrorComponent, NotFoundComponent } from "@/components/route-error";

import { BRAND_NAME } from "@/lib/brand";

import appCss from "../styles.css?url";

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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <AppShell queryClient={queryClient} />;
}
