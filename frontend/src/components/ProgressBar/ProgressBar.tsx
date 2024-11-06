import styles from './ProgressBar.module.scss';

export interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: 'green' | 'red'
}

export function ProgressBar({ progress, className, color }: ProgressBarProps) {
  return (
    <div className={`${styles.progressBar__container} ${className} ${color}`}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
