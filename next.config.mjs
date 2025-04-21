/** @type {import('next').NextConfig} */
const nextConfig = {
  // trailingSlash: true,
  // skipTrailingSlashRedirect: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "development" ? false : true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wordpress-429601-4091958.cloudwaysapps.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // redirects: async () => [
  //   {
  //     source: "/",
  //     destination: "/free-tools",
  //     permanent: true,
  //   },
  // ],
};

export default nextConfig;
