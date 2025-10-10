import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        port: "",
        pathname: "/system/resources/previews/**",
      },
    ],
  },
};

export default bundleAnalyzer(nextConfig);
