import { getProfile } from '@/lib/content';
import styles from './footer.module.scss';

export function Footer() {
    const { name } = getProfile();

    return (
        <footer className={styles.footer}>
            <div className={styles.footer__inner}>
                <span>
                    © {new Date().getFullYear()} {name}
                </span>
                <span>Hecho con Next.js, SCSS y GSAP</span>
            </div>
        </footer>
    );
}
