'use client';

import { useLenis } from 'lenis/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DURATION, EASE, gsap, useGSAP } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/use-reduced-motion';
import { NAV_ITEMS } from '@/lib/nav';
import styles from './header.module.scss';

interface HeaderProps {
    links: { href: string; label: string }[];
}

export function Header({ links }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === '/';
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tl = useRef<gsap.core.Timeline>(null);
    const hasOpened = useRef(false);
    const reduced = useReducedMotion();

    // Hides on scroll down, shows on scroll up
    const lenis = useLenis(({ scroll, direction }) => {
        setScrolled(scroll > 24);
        setHidden(direction === 1 && scroll > 200);
    });

    // Menu open/close timeline (reduced motion falls back to the --open class)
    useGSAP(
        () => {
            const menu = menuRef.current;
            if (!menu || reduced) return;
            tl.current?.kill();

            if (open) {
                hasOpened.current = true;
                tl.current = gsap
                    .timeline()
                    .fromTo(
                        menu,
                        { autoAlpha: 0, y: -24 },
                        { autoAlpha: 1, duration: DURATION.base, ease: 'power2.out', y: 0 }
                    )
                    .fromTo(
                        '[data-menu-item]',
                        { autoAlpha: 0, y: -32 },
                        { autoAlpha: 1, duration: DURATION.slow, ease: EASE.outExpo, stagger: 0.05, y: 0 },
                        '-=0.2'
                    )
                    .fromTo('[data-menu-foot]', { autoAlpha: 0 }, { autoAlpha: 1, duration: DURATION.base }, '-=0.5');
            } else if (hasOpened.current) {
                tl.current = gsap
                    .timeline()
                    .to('[data-menu-item]', { autoAlpha: 0, duration: 0.35, ease: 'power2.in', stagger: 0.03, y: 32 })
                    .to('[data-menu-foot]', { autoAlpha: 0, duration: 0.25 }, '<')
                    .to(menu, { autoAlpha: 0, duration: DURATION.base, ease: 'power2.in', y: 24 }, '-=0.15');
            }
        },
        { dependencies: [open, reduced], scope: menuRef }
    );

    useEffect(() => {
        if (open) {
            lenis?.stop();
            menuRef.current?.querySelector<HTMLElement>('a')?.focus();
        } else {
            lenis?.start();
        }
    }, [open, lenis]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setOpen(false);
            buttonRef.current?.focus();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    // Closes the menu, then scrolls to the section (or routes home)
    const goTo = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setOpen(false);
        if (!isHome) {
            router.push(`/#${id}`);
            return;
        }
        lenis?.start();
        lenis?.scrollTo(`#${id}`);
    };

    const className = [
        styles.header,
        hidden && !open && styles['header--hidden'],
        scrolled && !open && styles['header--scrolled'],
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <header className={className}>
            <div className={styles.header__inner}>
                <Link href="/" className={styles.header__logo} aria-label="Inicio" onClick={() => setOpen(false)}>
                    AL<span className={styles.header__dot}>.</span>
                </Link>
                <button
                    ref={buttonRef}
                    type="button"
                    className={[styles.header__toggle, open && styles['header__toggle--open']]
                        .filter(Boolean)
                        .join(' ')}
                    aria-expanded={open}
                    aria-controls="menu-indice"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className={styles['header__toggle-label']}>{open ? 'Cerrar' : 'Índice'}</span>
                    <span className={styles['header__toggle-icon']} aria-hidden="true" />
                </button>
            </div>

            <div
                ref={menuRef}
                id="menu-indice"
                className={[styles.header__menu, open && styles['header__menu--open']].filter(Boolean).join(' ')}
                inert={!open}
            >
                <nav aria-label="Índice" className={styles['header__menu-inner']}>
                    <ol className={styles.header__list}>
                        {NAV_ITEMS.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={isHome ? `#${item.id}` : `/#${item.id}`}
                                    className={styles.header__link}
                                    onClick={(e) => goTo(e, item.id)}
                                    data-menu-item=""
                                >
                                    <span className={styles.header__index}>{item.index}</span>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ol>
                    <ul className={styles.header__foot} data-menu-foot="">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} target="_blank" rel="noreferrer">
                                    {link.label} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
