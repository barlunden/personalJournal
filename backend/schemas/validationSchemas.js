const { title } = require("process");
const { z } = require("zod");
/**
 * Middleware to validate the request body against a Zod schema.
 * If validation fails, it responds with a 400 status and the validation issues.
 * If validation succeeds, it attaches the validated data to req.validateBody.
 *
 * @param {z.ZodTypeAny} schema - The Zod schema to validate against.
 * @returns {Function} Express middleware function.
 */

const addEntrySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  dateCreated: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return new Date();
      const date = new Date(val);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date;
    }),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  keywords: z
    .array(z.object({ value: z.string().min(1) }))
    .max(10)
    .optional(),
});

const entryArraySchema = z.array(addEntrySchema);

const entryParamsSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

module.exports = {
  addEntrySchema,
  entryArraySchema,
  entryParamsSchema,
};
