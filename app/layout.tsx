import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import 'lenis/dist/lenis.css';
import './globals.scss';
import '../components/layout/anchor-focus.scss';
import { geist, geistMono, instrumentSerif } from './fonts';
import { AnchorFocus } from '@/components/layout/anchor-focus';
import { BackToTop } from '@/components/layout/back-to-top';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MAIN_ID, SkipLink } from '@/components/layout/skip-link';
import { BackgroundField } from '@/components/motion/background-field';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { getProfile } from '@/lib/content';

// Marks the page as script-enabled so `[data-reveal]` is hidden only then (see styles/_base.scss).
// The mark is dropped after 5s: a bundle that never loads must not leave the content invisible
const JS_FLAG = `(function(d){d.classList.add('js');setTimeout(function(){d.classList.remove('js')},5000)})(document.documentElement)`;

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
        <html
            lang="es"
            className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`}
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
            </head>
            <body>
                <SkipLink />
                <BackgroundField />
                <SmoothScroll>
                    <Header links={socialLinks} />
                    <main id={MAIN_ID} tabIndex={-1}>
                        {children}
                    </main>
                    <Footer />
                    <BackToTop />
                    <AnchorFocus />
                </SmoothScroll>
                <Analytics />
            </body>
        </html>
    );
}
