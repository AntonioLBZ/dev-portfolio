'use client';

import { useEffect, useRef } from 'react';
import { createContourField, MAX_RIPPLES, RIPPLE_LIFE, type FieldState, type RGB } from '@/lib/motion/contour-field';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/use-reduced-motion';
import styles from './background-field.module.scss';

const INTERACTIVE = 'a, button, input, textarea, select, summary, [role="button"]';
const TAP_MAX_MS = 350;
const TAP_MAX_MOVE = 10;
const IDLE_FRAME = 1 / 20;
// Frame time (ms) above which the resolution starts to drop
const SLOW_FRAME = 34;

function parseHex(value: string | undefined): RGB | null {
    const hex = value?.trim().match(/^#([0-9a-f]{6})$/i)?.[1];
    if (!hex) return null;
    const n = parseInt(hex, 16);
    return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function accentOf(el: Element | null) {
    return parseHex(el?.closest<HTMLElement>('[data-accent]')?.dataset.accent);
}

// Accent of the [data-accent] block crossing the middle of the viewport
function accentInView() {
    const mid = window.innerHeight / 2;
    const band = window.innerHeight * 0.15;
    let best: HTMLElement | null = null;
    let bestDistance = Infinity;
    document.querySelectorAll<HTMLElement>('[data-accent]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top > mid + band || rect.bottom < mid - band) return;
        const distance = Math.abs((rect.top + rect.bottom) / 2 - mid);
        if (distance < bestDistance) {
            best = el;
            bestDistance = distance;
        }
    });
    return accentOf(best);
}

// Fixed contour-line background. Scroll, taps and the mouse drive it; never captures input.
// The glow takes the accent of the project in view (or under the cursor).
export function BackgroundField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const computed = getComputedStyle(document.documentElement);
        const accent = parseHex(computed.getPropertyValue('--color-accent')) ?? [1, 0.35, 0.12];
        const line = parseHex(computed.getPropertyValue('--color-text')) ?? [0.93, 0.91, 0.87];
        const field = createContourField(canvas, line);
        if (!field) return;

        const state: FieldState = {
            time: 0,
            scroll: window.scrollY,
            energy: 0,
            pointer: { x: 0, y: 0, strength: 0 },
            ripples: [],
            tint: [...accent],
        };
        let quality = 1;

        const resize = () => {
            field.resize(quality);
            field.render(state);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);

        const cleanup = () => {
            observer.disconnect();
            field.dispose();
        };

        // A single still frame
        if (reduced) {
            state.time = 40;
            return cleanup;
        }

        const target = { x: 0, y: 0, active: false };
        let tintTarget: RGB = accent;
        let lastScroll = window.scrollY;
        let sinceRender = 0;
        let sincePick = 0;
        let slow = 0;
        let tap: { id: number; x: number; y: number; at: number } | null = null;

        // Hover only exists for a mouse; touch relies on taps and scroll
        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === 'mouse') {
                if (!target.active) {
                    state.pointer.x = event.clientX;
                    state.pointer.y = event.clientY;
                }
                target.x = event.clientX;
                target.y = event.clientY;
                target.active = true;
            }
            if (
                tap &&
                tap.id === event.pointerId &&
                Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > TAP_MAX_MOVE
            ) {
                tap = null;
            }
        };
        const onPointerLeave = () => {
            target.active = false;
        };
        // A scroll gesture ends in pointercancel, so only real taps reach pointerup
        const onPointerDown = (event: PointerEvent) => {
            const onControl = (event.target as Element).closest(INTERACTIVE);
            tap =
                event.isPrimary && !onControl
                    ? { id: event.pointerId, x: event.clientX, y: event.clientY, at: performance.now() }
                    : null;
        };
        const onPointerUp = (event: PointerEvent) => {
            if (tap && tap.id === event.pointerId && performance.now() - tap.at < TAP_MAX_MS) {
                state.ripples.push({ x: event.clientX, y: event.clientY, start: state.time });
                state.ripples = state.ripples.slice(-MAX_RIPPLES);
            }
            tap = null;
        };
        const onPointerCancel = () => {
            tap = null;
        };

        const root = document.documentElement;
        const options = { passive: true } as const;
        window.addEventListener('pointermove', onPointerMove, options);
        window.addEventListener('pointerdown', onPointerDown, options);
        window.addEventListener('pointerup', onPointerUp, options);
        window.addEventListener('pointercancel', onPointerCancel, options);
        root.addEventListener('pointerleave', onPointerLeave, options);

        const tick = (_time: number, deltaMs: number) => {
            const dt = Math.min(deltaMs / 1000, 0.1);
            if (dt <= 0) return;

            const scrollY = window.scrollY;
            const speed = Math.abs(scrollY - lastScroll) / dt;
            lastScroll = scrollY;
            state.scroll = scrollY;
            state.energy += (Math.min(speed / 2500, 1) - state.energy) * (1 - Math.exp(-dt * 6));
            state.time += dt * (1 + state.energy * 2);

            const follow = 1 - Math.exp(-dt * 10);
            state.pointer.x += (target.x - state.pointer.x) * follow;
            state.pointer.y += (target.y - state.pointer.y) * follow;
            state.pointer.strength += ((target.active ? 1 : 0) - state.pointer.strength) * (1 - Math.exp(-dt * 5));

            sincePick += dt;
            if (sincePick > 0.15) {
                sincePick = 0;
                const hovered = target.active ? document.elementFromPoint(target.x, target.y) : null;
                tintTarget = accentOf(hovered) ?? accentInView() ?? accent;
            }
            const fade = 1 - Math.exp(-dt * 3);
            let tintMoving = false;
            for (let i = 0; i < 3; i++) {
                const delta = tintTarget[i] - state.tint[i];
                state.tint[i] += delta * fade;
                tintMoving ||= Math.abs(delta) > 0.002;
            }

            state.ripples = state.ripples.filter((ripple) => state.time - ripple.start < RIPPLE_LIFE);

            // Idle: only the slow drift is left, so render fewer frames
            sinceRender += dt;
            const busy = state.energy > 0.01 || state.ripples.length > 0 || state.pointer.strength > 0.01 || tintMoving;
            if (!busy && sinceRender < IDLE_FRAME) return;
            sinceRender = 0;
            field.render(state);

            // Lower the resolution if frames keep taking too long
            slow = deltaMs > SLOW_FRAME ? slow + dt : Math.max(0, slow - dt * 0.5);
            if (slow > 1.2 && quality > 0.5) {
                quality = Math.max(0.5, quality * 0.8);
                slow = 0;
                resize();
            }
        };
        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerCancel);
            root.removeEventListener('pointerleave', onPointerLeave);
            cleanup();
        };
    }, [reduced]);

    return <canvas ref={canvasRef} className={styles['background-field']} aria-hidden="true" />;
}
