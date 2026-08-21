import { getCurrentMember } from "@/lib/memberAuth";

export default async function PortalDashboardPage() {
  const member = await getCurrentMember();
  return (
    <div>
      <h1>Welcome</h1>
      <p>Signed in as {member?.email}.</p>
    </div>
  );
}
