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

const port = 3000;

app.use(express.json());
app.use(cors());

// add-entry
app.post("/add-entry", validateBody(addEntrySchema), async (req, res) => {
  
  try {
    const formData =
      req.body;

    if (!formData.title || !formData.content ) {
      res.send({ error: "You've left one or two mandatory fields empty."})
    }

    const journalEntry = await prisma.journalEntry.create({
      data: {
        title: formData.title,
        constent: formData.content,
        dateCreated: formData.dateCreated,
        imageUrl: formData.imageUrl,
        imageAlt: formData.imageAlt,
        keywords: {
          connectOrCreate: keywords.map((kw) => ({
            where: { value: kw.value },
            create: { value: kw.value },
          })),
        },
      },
      include: { keywords: true },
    });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error adding entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

// update-entry/:id

// delete-entry/:id

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
