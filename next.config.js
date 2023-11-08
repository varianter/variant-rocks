/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    }); // 针对 SVG 的处理规则

    return config;
  },
};

if (process.env.DOCKER) {
  nextConfig.output = "standalone";
}

if (process.env.NODE_ENV === 'development' && process.env.IGNORE_TLS) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

module.exports = nextConfig;
