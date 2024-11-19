const {
  withHydrationOverlay,
} = require("@builder.io/react-hydration-overlay/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** your config here */
};

module.exports = withHydrationOverlay({
  async rewrites() {
    return [
      {
        source: '/api/v1/', // Match API paths in the frontend
        destination: 'http://localhost:8000/api/v1/', // Proxy to your backend server
      },
    ]
  },
  /**
   * Optional: `appRootSelector` is the selector for the root element of your app. By default, it is `#__next` which works
   * for Next.js apps with pages directory. If you are using the app directory, you should change this to `main`.
   */
  appRootSelector: "main",
})(nextConfig); 