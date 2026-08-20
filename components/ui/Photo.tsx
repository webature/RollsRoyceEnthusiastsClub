import Image from "next/image";
import styles from "./Photo.module.css";

export default function Photo({
  src,
  alt,
  className,
  sizes = "(max-width: 850px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={className ? `${styles.photo} ${className}` : styles.photo}>
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
    </div>
  );
}
