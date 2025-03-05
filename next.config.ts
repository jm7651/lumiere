/** @type {import('next').NextConfig} */
// next.config.js 수정
const nextConfig = {
  output: "export",
  basePath: "/lumiere",
  images: {
    unoptimized: true,
  },
  distDir: "docs", // 빌드 출력 폴더를 docs로 변경
};

module.exports = nextConfig;
