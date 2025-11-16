import React from 'react';
import styles from './InfoBox.module.css';

interface InfoBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
}

export default function InfoBox({ children, type = 'info', title }: InfoBoxProps) {
  const icons = {
    info: '💡',
    warning: '⚠️',
    success: '✓',
    error: '🚨'
  };

  return (
    <div className={`${styles.infoBox} ${styles[type]}`}>
      {title && (
        <div className={styles.title}>
          <span className={styles.icon}>{icons[type]}</span>
          <strong>{title}</strong>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
