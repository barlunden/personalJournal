const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");
const { validateBody, validateParams } = require("./middleware/validationMiddleware");
const {
  addEntrySchema,
  entryParamsSchema,
  searchQuerySchema,
} = require("./schemas/validationSchemas");

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// ADD ENTRY
app.post(
  "/add-entry",
  validateBody(addEntrySchema),
  async (req, res) => {
    try {
      const parsed = req.body;
      const keywords = (parsed.keywords || [])
        .map((k) => k.toLowerCase())
        .filter((v, i, arr) => arr.indexOf(v) === i);

      const keywordRecords = await Promise.all(
        keywords.map((kw) =>
          prisma.keyword.upsert({
            where: { value: kw },
            update: {},
            create: { value: kw },
          })
        )
      );

      const entryData = {
        title: parsed.title,
        content: parsed.content,
        dateCreated: parsed.dateCreated
          ? new Date(parsed.dateCreated).toISOString()
          : undefined,
        imageUrl: parsed.imageUrl || undefined,
        imageAlt: parsed.imageAlt || undefined,
        keywords: {
          connect: keywordRecords.map((k) => ({ id: k.id })),
        },
      };

      const entry = await prisma.journalEntry.create({
        data: entryData,
        include: { keywords: true },
      });

      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to add entry." });
    }
  }
);

// GET ENTRIES
app.get("/get-entries", async (req, res) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      include: { keywords: true },
      orderBy: { dateCreated: "desc" },
    });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET ENTRY BY ID
app.get(
  "/get-entry/:entryId",
  validateParams(entryParamsSchema),
  async (req, res) => {
    const entryId = parseInt(req.params.entryId, 10);
    try {
      const entry = await prisma.journalEntry.findUnique({
        where: { id: entryId },
        include: { keywords: true },
      });
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// UPDATE ENTRY
app.patch(
  "/update-entry/:entryId",
  validateParams(entryParamsSchema),
  validateBody(addEntrySchema.partial()),
  async (req, res) => {
    const entryId = parseInt(req.params.entryId, 10);
    const parsed = req.body;
    try {
      let keywordConnect = undefined;
      if (parsed.keywords) {
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

      res.json({ success: "Updated entry" });
    } catch (error) {
      res.status(500).json({ error: error.message || "Error updating entry." });
    }
  }
);

// DELETE ENTRY
app.delete(
  "/delete-entry/:entryId",
  validateParams(entryParamsSchema),
  async (req, res) => {
    const entryId = parseInt(req.params.entryId, 10);
    try {
      const entry = await prisma.journalEntry.findUnique({
        where: { id: entryId },
        include: { keywords: true },
      });
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }

      await prisma.journalEntry.delete({
        where: { id: entryId },
      });

      // Clean up unused keywords
      for (const keyword of entry.keywords) {
        const keywordWithEntries = await prisma.keyword.findUnique({
          where: { id: keyword.id },
          include: { entries: true },
        });
        if (keywordWithEntries.entries.length === 1) {
          await prisma.keyword.delete({
            where: { id: keyword.id },
          });
        }
      }

      res.status(200).json({
        success: "Deleted entry and cleaned up unused keywords.",
      });
    } catch (error) {
      res.status(500).json({ error: "Error when deleting entry." });
    }
  }
);

// SEARCH
app.get("/search", async (req, res) => {
  const parseResult = searchQuerySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: "A keyword (1-50 chars) is required" });
  }
  const keyword = req.query.keyword.toLowerCase();

  try {
    const entries = await prisma.journalEntry.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              // mode: "insensitive", // Fjern denne om du får feil
            },
          },
          {
            keywords: {
              some: {
                value: {
                  contains: keyword,
                  // mode: "insensitive", // Fjern denne om du får feil
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
    res.status(500).json({ error: "Search failed" });
  }
});

// KEYWORDS
app.get("/keywords", async (req, res) => {
  try {
    const keywords = await prisma.keyword.findMany({
      include: {
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { value: "asc" },
    });
    res.status(200).json(keywords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch keywords" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
