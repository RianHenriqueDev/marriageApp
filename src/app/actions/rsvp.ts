"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { PhaseAttendance, RsvpStatus } from "@prisma/client";

export async function submitRsvp({
  token,
  status,
  confirmedPlusOnes = 0,
  attendance = PhaseAttendance.BOTH,
}: {
  token: string;
  status: RsvpStatus;
  confirmedPlusOnes?: number;
  attendance?: PhaseAttendance;
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

    const finalAttendance = status === "DECLINED" ? PhaseAttendance.NONE : attendance;

    const updated = await prisma.guest.update({
      where: { token },
      data: {
        status,
        attendance: finalAttendance,
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
