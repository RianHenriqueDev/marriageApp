"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AttendanceSelection, RsvpState } from "@prisma/client";

export async function submitRsvp({
  token,
  attendance,
  hasSpouse = false,
  childrenCount = 0,
  guestMessage,
}: {
  token: string;
  attendance: AttendanceSelection;
  hasSpouse?: boolean;
  childrenCount?: number;
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
    const safeChildren = Math.max(0, Math.min(10, Math.floor(childrenCount || 0)));
    const safeSpouse = Boolean(hasSpouse);
    
    // Titular (1) + Cônjuge (se marcado) + Filhos
    const totalConfirmed = isDeclined ? 0 : 1 + (safeSpouse ? 1 : 0) + safeChildren;
    const status: RsvpState = isDeclined ? RsvpState.DECLINED : RsvpState.CONFIRMED;

    const updated = await prisma.guest.update({
      where: { token },
      data: {
        attendance,
        status,
        hasSpouse: isDeclined ? false : safeSpouse,
        childrenCount: isDeclined ? 0 : safeChildren,
        confirmedGuests: totalConfirmed,
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
