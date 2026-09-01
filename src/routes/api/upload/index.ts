import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/upload/")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const formData = await request.formData();

				const media = formData.get("media") as File | null;

				if (!media || typeof media === "string" || media.size === 0) {
					return Response.json(
						{
							success: false,
							message: "File media tidak ditemukan atau kosong",
							data: null,
						},
						{ status: 400 },
					);
				}

				const isVideo = media.type.startsWith("video");
				const isImage = media.type.startsWith("image");

				if (!isVideo && !isImage) {
					return Response.json(
						{
							success: false,
							message: "Hanya format gambar atau video yang diperbolehkan",
							data: null,
						},
						{ status: 400 },
					);
				}

				const fileType = isVideo ? "video" : "image";

				// Create fresh FormData with field name matching backend requirements ('image' or 'video')
				const backendFormData = new FormData();
				backendFormData.append(fileType, media);

				const headers: Record<string, string> = {
					accept: "application/json",
				};

				// Note: Do NOT set 'Content-Type' header here.
				// Fetch automatically sets 'Content-Type: multipart/form-data; boundary=...'
				const res = await fetch(
					`${process.env.API_BASE_URL}/api/upload/${fileType}`,
					{
						method: "POST",
						headers,
						body: backendFormData,
					},
				);

				const result = await res.json();
				return Response.json(result, { status: res.status });
			},
		},
	},
});
