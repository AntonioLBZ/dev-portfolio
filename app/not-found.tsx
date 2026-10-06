import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
    return (
        <section className={styles['not-found']}>
            <p className={styles['not-found__code']}>404</p>
            <h1 className={styles['not-found__title']}>
                Esta página <em>no existe</em>
            </h1>
            <Link href="/" className={styles['not-found__link']}>
                ← Volver al inicio
            </Link>
        </section>
    );
}
