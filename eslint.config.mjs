import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Turns off rules that conflict with Prettier
    prettier,
    // Default ignores of eslint-config-next, plus Wrangler's generated files
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '.wrangler/**']),
]);

export default eslintConfig;
