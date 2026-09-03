import z from "zod/v3";
import { DISASTER_STATUS_LIST } from "../types";

export const disasterAttachmentSchema = z.object({
	media_url: z.string().min(1, "URL media wajib diisi"),
	media_type: z.string().min(1, "Tipe media wajib diisi"),
	media_preview: z.string().optional(),
});

export const createDisasterSchema = z.object({
	title: z
		.string()
		.min(3, "Judul laporan minimal 3 karakter")
		.max(150, "Judul laporan maksimal 150 karakter"),
	description: z.string().min(10, "Deskripsi laporan minimal 10 karakter"),
	city: z.string().min(2, "Kota/Kabupaten wajib diisi"),
	street: z.string().min(3, "Alamat atau jalan wajib diisi"),
	lat: z
		.number({ invalid_type_error: "Titik latitude harus berupa angka" })
		.min(-90, "Latitude tidak valid")
		.max(90, "Latitude tidak valid"),
	lng: z
		.number({ invalid_type_error: "Titik longitude harus berupa angka" })
		.min(-180, "Longitude tidak valid")
		.max(180, "Longitude tidak valid"),
	is_anon: z.boolean(),
	attachment: z
		.array(disasterAttachmentSchema)
		.min(1, "Minimal unggah 1 foto atau video bukti kejadian"),
});

export type CreateDisasterSchemaType = z.infer<typeof createDisasterSchema>;
export type DisasterAttachmentType = z.infer<typeof disasterAttachmentSchema>;

export const updateDisasterStatusSchema = z.object({
	status: z.enum(DISASTER_STATUS_LIST),
});

export type UpdateDisasterStatusSchemaType = z.infer<
	typeof updateDisasterStatusSchema
>;
