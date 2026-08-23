import z from "zod/v3";

export const signUpSchema = z.object({
	email: z.string().email("Gunakan email yang valid").toLowerCase().trim(),
	password: z
		.string()
		.min(8, "Password minimal 8 karakter")
		.toLowerCase()
		.trim(),
	confirm_password: z
		.string()
		.min(8, "Konfirmasi Password minimal 8 karakter")
		.toLowerCase()
		.trim(),
	data: z.object({
		display_name: z
			.string()
			.trim()
			.min(3, "Nama minimal 3 karakter")
			.regex(/^[a-zA-Z0-9 ]+$/, "Nama tidak boleh mengandung karakter khusus"),
	}),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
