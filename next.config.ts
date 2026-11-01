import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Static site, built into out/ and served by Cloudflare
    output: 'export',
    // No image optimizer in a static export
    images: { unoptimized: true },
    // Makes styles/abstracts available in every .scss
    sassOptions: {
        additionalData: `@use "abstracts" as *;`,
        loadPaths: [path.join(process.cwd(), 'styles')],
    },
};

export default nextConfig;
