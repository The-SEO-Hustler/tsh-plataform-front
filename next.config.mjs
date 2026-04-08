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
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/guides/:slug*",
      destination: "/playbooks/:slug*",
      permanent: true,
    },
    {
      source: "/guides",
      destination: "/playbooks",
      permanent: true,
    },
    {
      source: "/seo-competitor-analysis",
      destination: "/blog/seo-competitor-analysis",
      permanent: true,
    },
  ],
  rewrites: async () => {
    const firebaseAuthHelperDomain =
      process.env.FIREBASE_AUTH_HELPER_DOMAIN ||
      `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`;

    return {
      beforeFiles: [
        // Firebase Auth helper endpoints required when using a custom authDomain.
        {
          source: "/__/auth/:path*",
          destination: `https://${firebaseAuthHelperDomain}/__/auth/:path*`,
        },
        {
          source: "/__/firebase/init.json",
          destination: `https://${firebaseAuthHelperDomain}/__/firebase/init.json`,
        },
      ],
    };
  },
};

export default nextConfig;
