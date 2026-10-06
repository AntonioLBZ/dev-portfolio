import styles from './marquee.module.scss';

interface MarqueeProps {
    items: string[];
    reverse?: boolean;
    className?: string;
}

function Track({ items, hidden }: { items: string[]; hidden?: boolean }) {
    return (
        <ul className={styles.marquee__track} aria-hidden={hidden || undefined}>
            {items.map((item) => (
                <li key={item} className={styles.marquee__item}>
                    {item}
                    <span className={styles.marquee__sep} aria-hidden="true">
                        ✦
                    </span>
                </li>
            ))}
        </ul>
    );
}

// Bucle horizontal infinito solo con CSS: la lista va duplicada
export function Marquee({ items, reverse = false, className }: MarqueeProps) {
    const classes = [styles.marquee, reverse && styles['marquee--reverse'], className].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <div className={styles.marquee__inner}>
                <Track items={items} />
                <Track items={items} hidden />
            </div>
        </div>
    );
}
