/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // basePath는 제거하거나 다음과 같이 조건부로 설정
  basePath: process.env.VERCEL ? "" : "/lumiere",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
