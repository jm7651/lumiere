/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/lumiere",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
