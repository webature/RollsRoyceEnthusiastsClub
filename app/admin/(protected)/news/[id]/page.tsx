import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updatePost, deletePost } from "@/lib/actions/news";
import NewsForm from "@/components/admin/NewsForm";
import DeleteButton from "@/components/admin/DeleteButton";
import styles from "../../admin.module.css";

export default async function EditNewsPage(props: PageProps<"/admin/news/[id]">) {
  const { id } = await props.params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const boundUpdate = updatePost.bind(null, post.id);

  return (
    <>
      <div className={styles.header}>
        <h1>Edit news post</h1>
        <DeleteButton
          id={post.id}
          action={deletePost}
          confirmLabel={`Delete "${post.title}"? This cannot be undone.`}
          className={styles.deleteForm}
        />
      </div>
      <NewsForm
        action={boundUpdate}
        submitLabel="Save changes"
        initialValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: post.body,
          coverImage: post.coverImage ?? "",
          status: post.status,
        }}
      />
    </>
  );
}
