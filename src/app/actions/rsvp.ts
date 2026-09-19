"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitRsvp({
  token,
  status,
  confirmedPlusOnes = 0,
}: {
  token: string;
  status: "ACCEPTED" | "DECLINED";
  confirmedPlusOnes?: number;
}) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { token },
    });

    if (!guest) {
      return { success: false, error: "Convidado não encontrado." };
    }

    const safePlusOnes = Math.min(
      Math.max(0, confirmedPlusOnes),
      guest.allowedPlusOnes
    );

    const updated = await prisma.guest.update({
      where: { token },
      data: {
        status,
        confirmedPlusOnes: status === "ACCEPTED" ? safePlusOnes : 0,
        respondedAt: new Date(),
      },
    });

    revalidatePath(`/convite/${token}`);
    revalidatePath("/admin");

    return { success: true, guest: updated };
  } catch (error) {
    console.error("Erro ao registrar RSVP:", error);
    return { success: false, error: "Falha ao registrar resposta. Tente novamente." };
  }
}
