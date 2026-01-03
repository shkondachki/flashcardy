import styles from './Preloader.module.scss';

interface PreloaderProps {
  /**
   * Optional message to display below the spinner
   */
  message?: string;
  /**
   * Size variant: 'small', 'medium', or 'large'
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Variant: 'fullscreen' centers the loader, 'inline' for inline use
   * @default 'inline'
   */
  variant?: 'fullscreen' | 'inline';
  /**
   * Show only spinner without message (useful for buttons)
   * @default false
   */
  spinnerOnly?: boolean;
}

export function Preloader({
  message,
  size = 'small',
  variant = 'inline',
  spinnerOnly = false,
}: PreloaderProps) {
  const containerClass = variant === 'fullscreen' ? styles.fullscreen : styles.inline;
  const spinnerClass = `${styles.spinner} ${styles[size]}`;

  return (
    <div className={containerClass}>
      <div className={spinnerClass} aria-label="Loading" role="status">
        <span className={styles.visuallyHidden}>Loading</span>
      </div>
      {!spinnerOnly && message && (
        <div className={styles.message}>{message}</div>
      )}
    </div>
  );
}

