import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateEvent, deleteEvent } from "@/lib/actions/events";
import { toDatetimeLocal } from "@/lib/format";
import EventForm from "@/components/admin/EventForm";
import DeleteButton from "@/components/admin/DeleteButton";
import styles from "../../admin.module.css";

export default async function EditEventPage(props: PageProps<"/admin/events/[id]">) {
  const { id } = await props.params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const boundUpdate = updateEvent.bind(null, event.id);

  return (
    <>
      <div className={styles.header}>
        <h1>Edit event</h1>
        <DeleteButton
          id={event.id}
          action={deleteEvent}
          confirmLabel={`Delete "${event.title}"? This cannot be undone.`}
          className={styles.deleteForm}
        />
      </div>
      <EventForm
        action={boundUpdate}
        submitLabel="Save changes"
        initialValues={{
          title: event.title,
          slug: event.slug,
          excerpt: event.excerpt,
          body: event.body,
          coverImage: event.coverImage ?? "",
          location: event.location ?? "",
          startsAt: toDatetimeLocal(event.startsAt),
          endsAt: toDatetimeLocal(event.endsAt),
          status: event.status,
        }}
      />
    </>
  );
}
