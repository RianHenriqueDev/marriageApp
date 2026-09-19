"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AttendanceSelection, RsvpState } from "@prisma/client";

export async function submitRsvp({
  token,
  attendance,
  confirmedGuests,
  guestMessage,
}: {
  token: string;
  attendance: AttendanceSelection;
  confirmedGuests: number;
  guestMessage?: string;
}) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { token },
    });

    if (!guest) {
      return { success: false, error: "Convite não encontrado no sistema." };
    }

    const isDeclined = attendance === AttendanceSelection.DECLINED;
    const safeConfirmed = isDeclined
      ? 0
      : Math.min(Math.max(1, confirmedGuests), guest.maxGuests);

    const status: RsvpState = isDeclined ? RsvpState.DECLINED : RsvpState.CONFIRMED;

    const updated = await prisma.guest.update({
      where: { token },
      data: {
        attendance,
        status,
        confirmedGuests: safeConfirmed,
        guestMessage: guestMessage?.trim() || null,
        respondedAt: new Date(),
      },
    });

    revalidatePath(`/c/${token}`);
    revalidatePath(`/convite/${token}`);
    revalidatePath("/admin");

    return { success: true, guest: updated };
  } catch (error) {
    console.error("Erro ao registrar confirmação de presença:", error);
    return { success: false, error: "Não foi possível salvar sua resposta no momento. Por favor, tente novamente." };
  }
}
