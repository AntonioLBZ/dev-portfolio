import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
    title: 'dev-portfolio',
    description: 'Portfolio personal — en construcción',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}
