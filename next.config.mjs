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
  env: { NEXT_PUBLIC_APP_BUILD_ID: buildId },
};
export default nextConfig;
