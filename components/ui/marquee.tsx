import styles from './marquee.module.scss';

interface MarqueeProps {
    items: string[];
    reverse?: boolean;
    className?: string;
}

function Track({ items, clone }: { items: string[]; clone?: boolean }) {
    const classes = [styles.marquee__track, clone && styles['marquee__track--clone']].filter(Boolean).join(' ');

    return (
        <ul className={classes}>
            {items.map((item) => (
                <li key={item} className={styles.marquee__item}>
                    {item}
                    <span className={styles.marquee__sep}>✦</span>
                </li>
            ))}
        </ul>
    );
}

// CSS-only infinite horizontal loop; the list is duplicated. Decorative: the items are listed elsewhere
export function Marquee({ items, reverse = false, className }: MarqueeProps) {
    const classes = [styles.marquee, reverse && styles['marquee--reverse'], className].filter(Boolean).join(' ');

    return (
        <div className={classes} aria-hidden="true">
            <div className={styles.marquee__inner}>
                <Track items={items} />
                <Track items={items} clone />
            </div>
        </div>
    );
}
