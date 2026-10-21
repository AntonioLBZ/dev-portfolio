'use client';

import { useLenis } from 'lenis/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from '@/components/ui/external-link';
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

    // Any route change closes the menu, including browser back/forward
    const [menuPath, setMenuPath] = useState(pathname);
    if (pathname !== menuPath) {
        setMenuPath(pathname);
        setOpen(false);
    }

    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
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

    // Menu open/close timeline (reduced motion falls back to the --open class).
    // Links fade with opacity only: `visibility: hidden` would make them unfocusable while the menu opens
    useGSAP(
        () => {
            const menu = menuRef.current;
            if (!menu || reduced) return;
            tl.current?.kill();

            if (open) {
                hasOpened.current = true;
                gsap.set(menu, { visibility: 'visible' });
                tl.current = gsap
                    .timeline()
                    .fromTo(
                        menu,
                        { opacity: 0, y: -24 },
                        { duration: DURATION.base, ease: 'power2.out', opacity: 1, y: 0 }
                    )
                    .fromTo(
                        '[data-menu-item]',
                        { opacity: 0, y: -32 },
                        { duration: DURATION.slow, ease: EASE.outExpo, opacity: 1, stagger: 0.05, y: 0 },
                        '-=0.2'
                    )
                    .fromTo('[data-menu-foot]', { opacity: 0 }, { duration: DURATION.base, opacity: 1 }, '-=0.5');
            } else if (hasOpened.current) {
                tl.current = gsap
                    .timeline({ onComplete: () => gsap.set(menu, { visibility: 'hidden' }) })
                    .to('[data-menu-item]', { duration: 0.35, ease: 'power2.in', opacity: 0, stagger: 0.03, y: 32 })
                    .to('[data-menu-foot]', { duration: 0.25, opacity: 0 }, '<')
                    .to(menu, { duration: DURATION.base, ease: 'power2.in', opacity: 0, y: 24 }, '-=0.15');
            }
        },
        { dependencies: [open, reduced], scope: menuRef }
    );

    // Runs after the layout effect above, so the menu is already visible (GSAP set or --open class)
    useEffect(() => {
        if (open) {
            lenis?.stop();
            menuRef.current?.querySelector<HTMLElement>('a')?.focus();
        } else {
            lenis?.start();
        }
    }, [open, lenis]);

    // The menu covers the page: keep everything behind it out of Tab order and the a11y tree
    useEffect(() => {
        if (!open) return;
        // Already inert (the hidden back-to-top) stays as it is: closing the menu must not re-enable it
        const covered = [
            ...document.querySelectorAll<HTMLElement>('main, footer, [data-back-to-top], [data-skip-link]'),
        ].filter((el) => !el.inert);
        covered.forEach((el) => (el.inert = true));
        return () => covered.forEach((el) => (el.inert = false));
    }, [open]);

    // Open menu keyboard: Escape closes, Tab cycles inside the header, arrows/Home/End walk the menu links
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
                buttonRef.current?.focus();
                return;
            }

            if (e.key === 'Tab') {
                const tabbables = [...(headerRef.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [])];
                const first = tabbables[0];
                const last = tabbables[tabbables.length - 1];
                if (!first || !last) return;
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
                return;
            }

            const links = [...(menuRef.current?.querySelectorAll<HTMLElement>('a') ?? [])];
            const index = links.indexOf(document.activeElement as HTMLElement);
            if (index === -1) return;
            const target: Record<string, number> = {
                ArrowDown: index + 1,
                ArrowUp: index - 1,
                End: links.length - 1,
                Home: 0,
            };
            if (!(e.key in target)) return;
            e.preventDefault();
            links[(target[e.key] + links.length) % links.length].focus();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    // Closes the menu, then scrolls to the section (or routes home). <AnchorFocus> moves the focus
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
        <header ref={headerRef} className={className}>
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
                                <ExternalLink href={link.href}>{link.label}</ExternalLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
