import Link from "next/link";
import { prisma } from "@/lib/db";
import { deletePost } from "@/lib/actions/news";
import { formatDate } from "@/lib/content";
import DeleteButton from "@/components/admin/DeleteButton";
import styles from "../admin.module.css";

export default async function AdminNewsListPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className={styles.header}>
        <h1>News</h1>
        <Link className="btn btnDark" href="/admin/news/new">
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className={styles.empty}>No news posts yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      post.status === "published" ? styles.statusPublished : styles.statusDraft
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td>{post.publishedAt ? formatDate(post.publishedAt) : "—"}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/news/${post.id}`}>Edit</Link>
                    <DeleteButton
                      id={post.id}
                      action={deletePost}
                      confirmLabel={`Delete "${post.title}"? This cannot be undone.`}
                      className={styles.deleteForm}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
