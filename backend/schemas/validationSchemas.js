const { z } = require("zod");

const addEntrySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  dateCreated: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  keywords: z.array(z.string().min(1)).optional(),
});

const entryArraySchema = z.array(addEntrySchema);

const entryParamsSchema = z.object({
  id: z.string(),
});

module.exports = {
  addEntrySchema,
  entryArraySchema,
  entryParamsSchema,
};
