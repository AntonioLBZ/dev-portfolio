import styles from './skip-link.module.scss';

export const MAIN_ID = 'contenido';

// First focusable element; activation is handled by <AnchorFocus>
export function SkipLink() {
    return (
        <a href={`#${MAIN_ID}`} className={styles['skip-link']} data-skip-link="">
            Saltar al contenido
        </a>
    );
}
