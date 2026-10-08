'use client';

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './expandable.module.scss';

interface GroupState {
    openId: string | null;
    setOpenId: React.Dispatch<React.SetStateAction<string | null>>;
    pointerRef: React.RefObject<{ x: number; y: number }>;
}

const Group = createContext<GroupState | null>(null);

// Only one item of the group is open at a time
export function ExpandableGroup({ children }: { children: React.ReactNode }) {
    const [openId, setOpenId] = useState<string | null>(null);
    const pointerRef = useRef({ x: -1, y: -1 });
    const value = useMemo(() => ({ openId, setOpenId, pointerRef }), [openId]);

    return <Group value={value}>{children}</Group>;
}

interface ExpandableItemProps {
    // Always visible
    children: React.ReactNode;
    // Revealed on mouse hover, tap or Enter/Space; without it the item is a plain row
    details?: React.ReactNode;
    label: string;
    className?: string;
}

export function ExpandableItem({ children, details, label, className }: ExpandableItemProps) {
    const group = useContext(Group);
    const id = useId();
    const input = useRef('');
    // Set by Escape, cleared when the pointer re-enters or leaves: hover must not reopen what was just dismissed
    const dismissed = useRef(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const open = group?.openId === id;
    const setOpen = group?.setOpenId;

    // WCAG 1.4.13: hover/focus content can be dismissed without moving the pointer
    useEffect(() => {
        if (!open || !setOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            dismissed.current = true;
            // The panel turns inert on close: keep focus from falling back to <body>
            if (panel.current?.contains(document.activeElement)) trigger.current?.focus();
            setOpen((current) => (current === id ? null : current));
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, id, setOpen]);

    if (!group || !details) {
        return (
            <li className={className}>
                <div className={styles.expandable__header}>{children}</div>
            </li>
        );
    }

    const { pointerRef, setOpenId } = group;
    const panelId = `${id}-panel`;

    const onPointerMove = (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const { x, y } = pointerRef.current;
        pointerRef.current = { x: e.clientX, y: e.clientY };
        // A still pointer with content sliding under it (a neighbour collapsing) must not open anything
        if (!dismissed.current && (e.clientX !== x || e.clientY !== y)) setOpenId(id);
    };

    const onPointerLeave = (e: React.PointerEvent) => {
        dismissed.current = false;
        if (e.pointerType === 'mouse') setOpenId((current) => (current === id ? null : current));
    };

    // Mouse is handled by hover; touch, pen and keyboard toggle
    const onClick = () => {
        if (input.current !== 'mouse') setOpenId(open ? null : id);
    };

    return (
        <li
            className={className}
            data-open={open}
            onPointerEnter={() => (dismissed.current = false)}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            <div className={`${styles.expandable__header} ${styles['expandable__header--toggle']}`}>
                {children}
                <button
                    ref={trigger}
                    type="button"
                    className={styles.expandable__trigger}
                    aria-controls={panelId}
                    aria-expanded={open}
                    aria-label={`Detalles de ${label}`}
                    onClick={onClick}
                    onKeyDown={() => (input.current = 'keyboard')}
                    onPointerDown={(e) => (input.current = e.pointerType)}
                >
                    <span className={styles.expandable__icon} aria-hidden="true" />
                </button>
            </div>
            <div ref={panel} id={panelId} className={styles.expandable__panel} data-open={open} inert={!open}>
                <div className={styles.expandable__inner}>
                    <div className={styles.expandable__content}>{details}</div>
                </div>
            </div>
        </li>
    );
}
