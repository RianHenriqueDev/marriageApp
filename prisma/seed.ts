import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de convidados de demonstração...");

  const mockGuests = [
    {
      token: "carlos-moura-a7x9",
      name: "Carlos Moura",
      gender: "M" as const,
      category: "AMIGOS" as const,
      flowType: "GAMEPLAY" as const,
      scriptId: "m_01",
      customNote: "O chopp artesanal já tá gelando, nem invente de faltar!",
      allowedPlusOnes: 1,
      status: "PENDING" as const,
    },
    {
      token: "juliana-silva-k2p4",
      name: "Juliana Silva",
      gender: "F" as const,
      category: "AMIGOS" as const,
      flowType: "GAMEPLAY" as const,
      scriptId: "f_01",
      customNote: "Separe o salto confortável porque vamos cantar no microfone!",
      allowedPlusOnes: 1,
      status: "PENDING" as const,
    },
    {
      token: "vo-joao-e-vo-maria-d8v1",
      name: "Vô João e Vó Maria",
      gender: "M" as const,
      category: "FAMILIA_IDOSOS" as const,
      flowType: "CLASSIC" as const,
      scriptId: null,
      customNote: "A presença e a bênção de vocês é o nosso maior presente de casamento.",
      allowedPlusOnes: 0,
      status: "PENDING" as const,
    },
    {
      token: "rodrigo-padrim-x9f2",
      name: "Rodrigo (Padrinho)",
      gender: "M" as const,
      category: "PADRINHOS" as const,
      flowType: "CLASSIC" as const,
      scriptId: null,
      customNote: "Missão dada é missão cumprida. Contamos com você no altar!",
      allowedPlusOnes: 1,
      status: "ACCEPTED" as const,
      confirmedPlusOnes: 1,
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
