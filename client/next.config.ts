import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"],
          }
        : false,
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@/components",
      "@/config",
      "@/contexts",
      "@/font",
      "@/hooks",
      "@/lib",
      "@/schemas",
      "@/services",
    ],
    esmExternals: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        port: "",
        pathname: "/system/resources/previews/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      }
    ],
    minimumCacheTTL: 60,
  },

  compress: true,
  poweredByHeader: false,
  output: "standalone",
};

export default bundleAnalyzer(nextConfig);
