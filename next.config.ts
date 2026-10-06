import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Mixins y breakpoints de styles/abstracts disponibles en todos los .scss
    sassOptions: {
        additionalData: `@use "abstracts" as *;`,
        loadPaths: [path.join(process.cwd(), 'styles')],
    },
};

export default nextConfig;
