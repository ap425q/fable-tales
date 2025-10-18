import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["ecikiueohylxghlgouyb.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecikiueohylxghlgouyb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
}

export default nextConfig
