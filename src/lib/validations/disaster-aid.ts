import z from "zod/v3";

export const disasterAidAttachmentSchema = z.object({
	media_url: z.string().min(1, "URL media wajib diisi"),
	media_type: z.string().min(1, "Tipe media wajib diisi"),
	media_preview: z.string().optional(),
});

export const disasterAidItemSchema = z.object({
	item_name: z.string().min(1, "Nama barang logistik wajib diisi"),
	item_price: z.coerce
		.number({ invalid_type_error: "Harga barang harus berupa angka" })
		.min(0, "Harga barang minimal Rp 0"),
	quantity: z.coerce
		.number({ invalid_type_error: "Jumlah harus berupa angka" })
		.min(1, "Jumlah barang minimal 1"),
});

export const createDisasterAidSchema = z.object({
	disaster_id: z.string().min(1, "ID bencana wajib diisi"),
	attachments: z
		.array(disasterAidAttachmentSchema)
		.min(1, "Minimal unggah 1 bukti atau dokumentasi bantuan"),
	items: z
		.array(disasterAidItemSchema)
		.min(1, "Minimal masukkan 1 barang bantuan logistik"),
});

export type CreateDisasterAidSchemaType = z.infer<
	typeof createDisasterAidSchema
>;
export type DisasterAidItemType = z.infer<typeof disasterAidItemSchema>;
export type DisasterAidAttachmentType = z.infer<
	typeof disasterAidAttachmentSchema
>;
