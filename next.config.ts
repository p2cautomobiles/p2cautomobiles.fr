import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Le formulaire de reprise envoie jusqu'à 6 photos, réduites dans le navigateur (≈ 400 Ko chacune).
    serverActions: { bodySizeLimit: "8mb" },
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
