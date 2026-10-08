import styles from './external-link.module.scss';

type ExternalLinkProps = Omit<React.ComponentProps<'a'>, 'target' | 'rel'>;

// Opens in a new tab and says so to assistive tech; the arrow is decorative
export function ExternalLink({ children, ...props }: ExternalLinkProps) {
    return (
        <a {...props} target="_blank" rel="noreferrer">
            {children}
            <span aria-hidden="true"> ↗</span>
            <span className={styles['external-link__hint']}> (se abre en una pestaña nueva)</span>
        </a>
    );
}
