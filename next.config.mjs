/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['tailwindui.com', 'images.unsplash.com', 'images.pexels.com', 'example.com', 'res.cloudinary.com', 'img.freepik.com','plus.unsplash.com'], // Add the hostname here
    },
    eslint: {
        ignoreDuringBuilds: true, // ESLint errors will be ignored during the build process
    },
    typescript: {
        ignoreBuildErrors: true, // TypeScript errors will be ignored during the build process
    },
};

export default nextConfig;
