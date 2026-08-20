"use client";

export default function DeleteButton({
  id,
  action,
  confirmLabel,
  className,
}: {
  id: string;
  action: (formData: FormData) => void;
  confirmLabel: string;
  className?: string;
}) {
  return (
    <form
      className={className}
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmLabel)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit">Delete</button>
    </form>
  );
}
