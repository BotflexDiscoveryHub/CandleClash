import styles from './ProgressBar.module.scss';

export interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={`${styles.progressBar__container} ${className}`}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
