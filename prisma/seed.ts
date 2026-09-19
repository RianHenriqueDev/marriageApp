import { PrismaClient, AttendanceSelection, RsvpState } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de convidados de demonstração (Quiet Luxury)...");

  const mockGuests = [
    {
      token: "tios-paulo-e-lucia-8a2",
      name: "Tios Paulo & Lúcia",
      phone: "(16) 99123-4567",
      maxGuests: 2,
      confirmedGuests: 2,
      attendance: AttendanceSelection.BOTH,
      status: RsvpState.CONFIRMED,
      guestMessage: "Estaremos presentes com imensa alegria para abençoar a união de vocês!",
    },
    {
      token: "carlos-moura-a7x9",
      name: "Carlos Moura",
      phone: "(16) 99876-5432",
      maxGuests: 2,
      confirmedGuests: 0,
      attendance: AttendanceSelection.BOTH,
      status: RsvpState.PENDING,
      guestMessage: null,
    },
    {
      token: "juliana-silva-k2p4",
      name: "Juliana Silva & Família",
      phone: "(16) 99234-5678",
      maxGuests: 3,
      confirmedGuests: 3,
      attendance: AttendanceSelection.BOTH,
      status: RsvpState.CONFIRMED,
      guestMessage: "Parabéns ao casal mais lindo! Mal podemos esperar pelo grande dia.",
    },
    {
      token: "vo-joao-e-vo-maria-d8v1",
      name: "Vô João & Vó Maria",
      phone: null,
      maxGuests: 2,
      confirmedGuests: 0,
      attendance: AttendanceSelection.ONLY_CEREMONY,
      status: RsvpState.PENDING,
      guestMessage: null,
    },
  ];

  for (const guest of mockGuests) {
    await prisma.guest.upsert({
      where: { token: guest.token },
      update: {},
      create: guest,
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
