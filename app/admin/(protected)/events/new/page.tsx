import EventForm from "@/components/admin/EventForm";
import { createEvent } from "@/lib/actions/events";
import styles from "../../admin.module.css";

export default function NewEventPage() {
  return (
    <>
      <div className={styles.header}>
        <h1>New event</h1>
      </div>
      <EventForm action={createEvent} submitLabel="Create event" />
    </>
  );
}
