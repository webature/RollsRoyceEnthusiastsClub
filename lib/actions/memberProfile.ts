"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/memberAuth";

export type ProfileFormState = { error?: string; success?: boolean } | undefined;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const currentMember = await getCurrentMember();
  if (!currentMember) redirect("/portal/login");

  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const secondaryName = str(formData, "secondaryName");
  const phone = str(formData, "phone");
  const addressLine1 = str(formData, "addressLine1");
  const addressLine2 = str(formData, "addressLine2");
  const city = str(formData, "city");
  const postcode = str(formData, "postcode");
  const country = str(formData, "country");

  if (!firstName || !lastName) {
    return { error: "First and last name are required." };
  }

  await prisma.member.update({
    where: { id: currentMember.id },
    data: {
      firstName,
      lastName,
      secondaryName: secondaryName || null,
      phone: phone || null,
      addressLine1: addressLine1 || null,
      addressLine2: addressLine2 || null,
      city: city || null,
      postcode: postcode || null,
      country: country || null,
    },
  });

  revalidatePath("/portal/profile");
  return { success: true };
}
