import styles from "./loading.module.scss";

export default function LoadingSpinner() {
  return (
    <div className={styles.loading}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-8 border-gray-200 border-t-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
