import styles from "./GradientBackground.module.css";

const GradientBackground = () => {
  return (
    <div className={styles.background}>
      <div className={`${styles.blob} ${styles.blobOne}`} />
      <div className={`${styles.blob} ${styles.blobTwo}`} />
      <div className={`${styles.blob} ${styles.blobThree}`} />
      <div className={styles.grid} />
    </div>
  );
};

export default GradientBackground;