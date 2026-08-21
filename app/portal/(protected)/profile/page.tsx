import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/memberAuth";
import { prisma } from "@/lib/db";
import ProfileForm from "@/components/ProfileForm";
import styles from "../portal.module.css";

export default async function ProfilePage() {
  const currentMember = await getCurrentMember();
  if (!currentMember) redirect("/portal/login");

  const member = await prisma.member.findUnique({ where: { id: currentMember.id } });
  if (!member) redirect("/portal/login");

  return (
    <>
      <div className={styles.header}>
        <h1>Your details</h1>
      </div>
      <ProfileForm
        initialValues={{
          firstName: member.firstName,
          lastName: member.lastName,
          secondaryName: member.secondaryName ?? "",
          phone: member.phone ?? "",
          addressLine1: member.addressLine1 ?? "",
          addressLine2: member.addressLine2 ?? "",
          city: member.city ?? "",
          postcode: member.postcode ?? "",
          country: member.country ?? "",
        }}
      />
    </>
  );
}
