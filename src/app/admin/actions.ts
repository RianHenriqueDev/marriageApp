"use server";

import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/utils";
import { Category, FlowType, Gender, PhaseAttendance } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { pickUniqueScript } from "@/data/scripts";

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
  return { success: false, error: "Senha de Game Master incorreta!" };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  revalidatePath("/admin");
}

export async function createGuest(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const gender = (formData.get("gender") as Gender) || Gender.M;
    const category = (formData.get("category") as Category) || Category.AMIGOS;
    const flowType = (formData.get("flowType") as FlowType) || FlowType.GAMEPLAY;
    const scriptIdParam = (formData.get("scriptId") as string) || null;
    const customNote = (formData.get("customNote") as string) || null;
    const allowedPlusOnes = parseInt((formData.get("allowedPlusOnes") as string) || "0", 10);

    if (!name || name.trim().length === 0) {
      return { success: false, error: "Nome do convidado é obrigatório." };
    }

    const token = generateToken(name);

    let assignedScriptId = scriptIdParam;
    if (!assignedScriptId && flowType === FlowType.GAMEPLAY) {
      // Buscar scripts já utilizados para o mesmo gênero para garantir diversidade
      const existingGuests = await prisma.guest.findMany({
        where: { gender, scriptId: { not: null } },
        select: { scriptId: true },
      });
      const usedScriptIds = existingGuests
        .map((g) => g.scriptId)
        .filter((id): id is string => Boolean(id));

      assignedScriptId = pickUniqueScript(gender, usedScriptIds);
    }

    const guest = await prisma.guest.create({
      data: {
        token,
        name: name.trim(),
        gender,
        category,
        flowType,
        scriptId: assignedScriptId,
        customNote: customNote ? customNote.trim() : null,
        allowedPlusOnes: isNaN(allowedPlusOnes) ? 0 : allowedPlusOnes,
      },
    });

    revalidatePath("/admin");
    return { success: true, guest };
  } catch (error) {
    console.error("Erro ao criar convidado:", error);
    return { success: false, error: "Falha ao salvar convidado." };
  }
}

export async function updateGuest(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const gender = (formData.get("gender") as Gender) || Gender.M;
    const category = (formData.get("category") as Category) || Category.AMIGOS;
    const flowType = (formData.get("flowType") as FlowType) || FlowType.GAMEPLAY;
    const scriptId = (formData.get("scriptId") as string) || null;
    const customNote = (formData.get("customNote") as string) || null;
    const allowedPlusOnes = parseInt((formData.get("allowedPlusOnes") as string) || "0", 10);

    const attendance = (formData.get("attendance") as PhaseAttendance) || undefined;

    const guest = await prisma.guest.update({
      where: { id },
      data: {
        name: name.trim(),
        gender,
        category,
        flowType,
        scriptId: scriptId || null,
        customNote: customNote ? customNote.trim() : null,
        allowedPlusOnes: isNaN(allowedPlusOnes) ? 0 : allowedPlusOnes,
        ...(attendance ? { attendance } : {}),
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
