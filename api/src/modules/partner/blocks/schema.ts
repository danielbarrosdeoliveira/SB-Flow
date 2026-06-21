import { z } from "zod";

export const createBlockSchema = z
  .object({
    professionalId: z.number().optional(),
    startTime: z.string(),
    endTime: z.string(),
    reason: z.string().max(500).optional(),
    allDay: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.allDay) return true;
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end > start;
    },
    { message: "endTime deve ser após startTime", path: ["endTime"] },
  );

export type CreateBlockInput = z.infer<typeof createBlockSchema>;
