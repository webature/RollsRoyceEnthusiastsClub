import NewsForm from "@/components/admin/NewsForm";
import { createPost } from "@/lib/actions/news";
import styles from "../../admin.module.css";

export default function NewNewsPage() {
  return (
    <>
      <div className={styles.header}>
        <h1>New news post</h1>
      </div>
      <NewsForm action={createPost} submitLabel="Create post" />
    </>
  );
}
