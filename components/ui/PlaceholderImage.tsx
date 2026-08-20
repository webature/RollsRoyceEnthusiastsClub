import styles from "./PlaceholderImage.module.css";

export default function PlaceholderImage({
  angle = 135,
  caption,
  className,
}: {
  angle?: number;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={className ? `${styles.placeholder} ${className}` : styles.placeholder}
      style={{ "--angle": `${angle}deg` } as React.CSSProperties}
      role="img"
      aria-label={caption ?? "Placeholder for licensed RREC photography"}
    >
      {caption ? <span className={styles.label}>{caption}</span> : null}
    </div>
  );
}
