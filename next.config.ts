import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Makes styles/abstracts available in every .scss
    sassOptions: {
        additionalData: `@use "abstracts" as *;`,
        loadPaths: [path.join(process.cwd(), 'styles')],
    },
};

export default nextConfig;
