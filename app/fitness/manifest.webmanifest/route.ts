import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export function GET() {
  const manifest: MetadataRoute.Manifest = {
    id: "/fitness",
    name: "운동의 계절 · 현준 & 유진",
    short_name: "운동의 계절",
    description: "현준과 유진의 운동 기록과 30회 성장 여정",
    start_url: "/fitness",
    scope: "/fitness",
    display: "standalone",
    background_color: "#f5f2e9",
    theme_color: "#32695d",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/fitness-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/fitness-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/fitness-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/fitness-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
  return Response.json(manifest, {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
