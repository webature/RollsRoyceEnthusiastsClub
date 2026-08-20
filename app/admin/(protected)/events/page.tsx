import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteEvent } from "@/lib/actions/events";
import { formatDate } from "@/lib/content";
import DeleteButton from "@/components/admin/DeleteButton";
import styles from "../admin.module.css";

export default async function AdminEventsListPage() {
  const events = await prisma.event.findMany({ orderBy: { startsAt: "desc" } });

  return (
    <>
      <div className={styles.header}>
        <h1>Events</h1>
        <Link className="btn btnDark" href="/admin/events/new">
          + New event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className={styles.empty}>No events yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Starts</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      event.status === "published" ? styles.statusPublished : styles.statusDraft
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td>{formatDate(event.startsAt)}</td>
                <td>{event.location ?? "—"}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/events/${event.id}`}>Edit</Link>
                    <DeleteButton
                      id={event.id}
                      action={deleteEvent}
                      confirmLabel={`Delete "${event.title}"? This cannot be undone.`}
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
