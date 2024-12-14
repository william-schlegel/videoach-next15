import "./src/env.js";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" },
      { protocol: "https", hostname: "videoach-*.s3.eu-west-3.amazonaws.com" },
    ],
  },
};

export default withNextIntl(config);
