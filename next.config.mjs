import { execFileSync } from "node:child_process";
const buildId =
  process.env.VERCEL_DEPLOYMENT_ID ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  (() => {
    try {
      return execFileSync("git", ["rev-parse", "HEAD"], {
        encoding: "utf8",
      }).trim();
    } catch {
      return "local";
    }
  })();
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/documents/trip/mantra-booking-confirmation.pdf", headers: [
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
      { key: "X-Robots-Tag", value: "noindex, noarchive" },
    ] }];
  },
  env: { NEXT_PUBLIC_APP_BUILD_ID: buildId },
};
export default nextConfig;
