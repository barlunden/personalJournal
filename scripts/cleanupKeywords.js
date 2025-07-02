const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupKeywords() {
  const allKeywords = await prisma.keyword.findMany({ include: { entries: true } });

  for (const kw of allKeywords) {
    const lower = kw.value.toLowerCase();
    if (kw.value !== lower) {
      // Finn om lowercase-versjonen finst frå før
      const existing = await prisma.keyword.findUnique({ where: { value: lower } });
      if (existing) {
        // Flytt alle entries frå kw til existing
        for (const entry of kw.entries) {
          await prisma.journalEntry.update({
            where: { id: entry.id },
            data: {
              keywords: {
                connect: { id: existing.id },
                disconnect: { id: kw.id },
              },
            },
          });
        }
        // Slett kw
        await prisma.keyword.delete({ where: { id: kw.id } });
        console.log(`Merged and deleted duplicate keyword: ${kw.value}`);
      } else {
        // Oppdater kw til lowercase
        await prisma.keyword.update({ where: { id: kw.id }, data: { value: lower } });
        console.log(`Renamed keyword ${kw.value} -> ${lower}`);
      }
    }
  }
  console.log("Done!");
  await prisma.$disconnect();
}

cleanupKeywords().catch(e => {
  console.error(e);
  prisma.$disconnect();
});