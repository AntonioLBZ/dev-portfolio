'use client';

import { useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

// Last scroll position per route, used to restore it on back/forward
const positions = new Map<string, number>();

// Lenis keeps its own scroll state, which neither the browser nor Next resets on navigation:
// new pages opened at the old offset and back/forward landed at the top
export function RouteScroll() {
    const pathname = usePathname();
    const lenis = useLenis();
    const current = useRef(pathname);
    const popTarget = useRef<string | null>(null);

    useLenis(({ scroll }) => positions.set(current.current, scroll), []);

    useEffect(() => {
        const onPopState = () => {
            popTarget.current = window.location.pathname;
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    // Layout effect: runs before the browser (and the view transition) paints the new page
    useLayoutEffect(() => {
        if (!lenis || current.current === pathname) return;
        current.current = pathname;

        const saved = popTarget.current === pathname ? positions.get(pathname) : undefined;
        popTarget.current = null;
        // A hash target is scrolled by Next/Lenis anchors
        if (saved === undefined && window.location.hash) return;

        lenis.resize();
        lenis.scrollTo(saved ?? 0, { immediate: true, force: true });
    }, [lenis, pathname]);

    return null;
}
