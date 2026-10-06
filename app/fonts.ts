import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';

export const instrumentSerif = Instrument_Serif({
    style: ['normal', 'italic'],
    subsets: ['latin', 'latin-ext'],
    variable: '--font-instrument-serif',
    weight: '400',
});

export const geist = Geist({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-geist',
});

export const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
});
