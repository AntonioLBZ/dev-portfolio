import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import 'lenis/dist/lenis.css';
import './globals.scss';
import { geist, geistMono, instrumentSerif } from './fonts';
import { BackToTop } from '@/components/layout/back-to-top';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { BackgroundField } from '@/components/motion/background-field';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { getProfile } from '@/lib/content';

const profile = getProfile();
const socialLinks = [
    { href: profile.github, label: 'GitHub' },
    { href: profile.linkedin, label: 'LinkedIn' },
];

export const metadata: Metadata = {
    title: {
        default: `${profile.name} — ${profile.title}`,
        template: `%s — ${profile.name}`,
    },
    description: profile.about,
};

export const viewport: Viewport = {
    themeColor: '#0f0e0c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`}>
            <body>
                <BackgroundField />
                <noscript>
                    <style>{'[data-reveal]{opacity:1}'}</style>
                </noscript>
                <SmoothScroll>
                    <Header links={socialLinks} />
                    <main>{children}</main>
                    <Footer />
                    <BackToTop />
                </SmoothScroll>
                <Analytics />
            </body>
        </html>
    );
}
