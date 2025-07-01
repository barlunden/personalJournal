const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  addEntrySchema,
  entryArraySchema,
  entryParamsSchema,
} = require("./schemas/validationSchemas");

const {
  validateBody,
  validateParams,
} = require("./middleware/validationMiddleware");

const { z } = require("zod");

// This is a simple Express.js server setup with Prisma ORM and Zod for validation.

const app = express();

const port = 4000;

app.use(express.json());
app.use(cors());

// add-entry
app.post("/add-entry", async (req, res) => {
  try {
    const parsed = addEntrySchema.parse(req.body);

    // Make all keywords lowercase
    const keywords = (parsed.keywords || []).map((k) => k.toLowerCase());

    // Create or reuse keywords
    const keywordRecords = await Promise.all(
      keywords.map((kw) =>
        prisma.keyword.upsert({
          where: { value: kw },
          update: {},
          create: { value: kw },
        })
      )
    );

    const entry = await prisma.journalEntry.create({
      data: {
        ...parsed,
        keywords: {
          connect: keywordRecords.map((k) => ({ id: k.id })),
        },
      },
      include: { keywords: true },
    });

    res.json(entry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return detailed validation errors
      return res.status(400).json({ errors: error.errors });
    }
    // Return other errors
    res.status(400).json({ error: error.message });
  }
});

// get-entries endpoint
app.get("/get-entries", async (req, res) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      include: { keywords: true },
      orderBy: { dateCreated: "desc" },
    });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get-entry/:id
app.get("/get-entry/:entryId", async (req, res) => {
  const entryId = parseInt(req.params.entryId, 10);

  if (isNaN(entryId)) {
    return res.status(400).json({ error: "Invalid Entry ID" });
  }

  const entry = await prisma.journalEntry.findUnique({
    where: { id: entryId },
    include: { keywords: true },
  });

  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  res.send(entry);
});

// update-entry/:id
app.patch("/update-entry/:entryId", async (req, res) => {
  const entryId = parseInt(req.params.entryId);
  if (isNaN(entryId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const parsed = addEntrySchema.partial().parse(req.body);

    let keywordConnect = undefined;
    if (parsed.keywords) {
      // Gjør alle keywords til lowercase
      const keywords = parsed.keywords.map((k) => k.toLowerCase());
      const keywordRecords = await Promise.all(
        keywords.map((kw) =>
          prisma.keyword.upsert({
            where: { value: kw },
            update: {},
            create: { value: kw },
          })
        )
      );
      keywordConnect = {
        keywords: {
          set: keywordRecords.map((k) => ({ id: k.id })),
        },
      };
    }

    const { keywords, ...rest } = parsed;

    await prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        ...rest,
        ...(keywordConnect ? keywordConnect : {}),
      },
    });

    res.send({ success: "Updated entry" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error updating entry." });
  }
});

// delete-entry/:id
app.delete("/delete-entry/:entryId", async (req, res) => {
  const entryId = parseInt(req.params.entryId);
  if (isNaN(entryId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    // Finn keywords som er knytt til innlegget
    const entry = await prisma.journalEntry.findUnique({
      where: { id: entryId },
      include: { keywords: true },
    });

    // Slett journalEntry
    await prisma.journalEntry.delete({
      where: { id: entryId },
    });

    // Sjekk og slett ubrukte keywords
    for (const keyword of entry.keywords) {
      const count = await prisma.keyword.findUnique({
        where: { id: keyword.id },
        include: { entries: true },
      });
      if (count.entries.length === 1) {
        // Dette var siste entry med dette keywordet, så vi kan slette det
        await prisma.keyword.delete({
          where: { id: keyword.id },
        });
      }
    }

    res.status(200).json({
      success: `Deleted entry and cleaned up unused keywords.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error when deleting entry." });
  }
});

app.get("/search", async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }
  try {
    const entries = await prisma.journalEntry.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            keywords: {
              some: {
                value: {
                  contains: keyword.toLowerCase(),
                },
              },
            },
          },
        ],
      },
      include: { keywords: true },
    });
    res.json(entries);
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

app.get("/keywords", async (req, res) => {
  try {
    const keywords = await prisma.keyword.findMany({
      orderBy: { value: "asc" },
      include: { entries: true }, // <-- dette gir deg alle tilknytta journalEntry
    });
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch keywords" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
