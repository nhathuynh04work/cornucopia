import z from "zod";

const ModuleSchema = z.object({
	title: z.string(),
});

export const UpdateModuleSchema = ModuleSchema.partial();
