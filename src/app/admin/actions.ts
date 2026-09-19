"use server";

import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/utils";
import { AttendanceSelection, RsvpState } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function loginAdmin(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD || "casamento12122026";
  if (password === expectedPassword) {
    const cookieStore = cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Senha de acesso incorreta." };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  revalidatePath("/admin");
}

export async function createGuest(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = (formData.get("phone") as string) || null;
    const maxGuests = parseInt((formData.get("maxGuests") as string) || "1", 10);

    if (!name || name.trim().length === 0) {
      return { success: false, error: "O nome do convidado é obrigatório." };
    }

    const token = generateToken(name);

    const guest = await prisma.guest.create({
      data: {
        token,
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        maxGuests: isNaN(maxGuests) || maxGuests < 1 ? 1 : maxGuests,
        confirmedGuests: 0,
        attendance: AttendanceSelection.BOTH,
        status: RsvpState.PENDING,
      },
    });

    revalidatePath("/admin");
    return { success: true, guest };
  } catch (error) {
    console.error("Erro ao cadastrar convidado:", error);
    return { success: false, error: "Falha ao cadastrar convidado." };
  }
}

export async function updateGuest(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = (formData.get("phone") as string) || null;
    const maxGuests = parseInt((formData.get("maxGuests") as string) || "1", 10);
    const confirmedGuests = parseInt((formData.get("confirmedGuests") as string) || "0", 10);
    const attendance = (formData.get("attendance") as AttendanceSelection) || AttendanceSelection.BOTH;
    const status = (formData.get("status") as RsvpState) || RsvpState.PENDING;

    if (!name || name.trim().length === 0) {
      return { success: false, error: "O nome é obrigatório." };
    }

    const guest = await prisma.guest.update({
      where: { id },
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        maxGuests: isNaN(maxGuests) || maxGuests < 1 ? 1 : maxGuests,
        confirmedGuests: isNaN(confirmedGuests) ? 0 : confirmedGuests,
        attendance,
        status,
      },
    });

    revalidatePath("/admin");
    return { success: true, guest };
  } catch (error) {
    console.error("Erro ao atualizar convidado:", error);
    return { success: false, error: "Falha ao atualizar convidado." };
  }
}

export async function deleteGuest(id: string) {
  try {
    await prisma.guest.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir convidado:", error);
    return { success: false, error: "Falha ao excluir convidado." };
  }
}
