/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import {
	Film,
	Image as ImageIcon,
	Loader2,
	Maximize2,
	Play,
	Trash2,
	UploadCloud,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { MediaPreviewModal } from "#/components/disaster/media-renderer";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import type { DisasterAttachmentType } from "#/lib/validations/disaster";

interface UploadingFile {
	id: string;
	file: File;
	previewUrl: string;
	mediaType: "image" | "video";
	progress: number;
}

interface MediaDropzoneProps {
	value: DisasterAttachmentType[];
	onChange: (attachments: DisasterAttachmentType[]) => void;
	disabled?: boolean;
}

export function MediaDropzone({
	value = [],
	onChange,
	disabled = false,
}: MediaDropzoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
	const [previewModal, setPreviewModal] = useState<{
		isOpen: boolean;
		src: string;
		mediaType: string;
		title?: string;
	}>({
		isOpen: false,
		src: "",
		mediaType: "",
	});

	const valueRef = useRef(value);
	valueRef.current = value;
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	const uploadFile = useCallback(async (file: File) => {
		const tempId = crypto.randomUUID();
		const isVideo = file.type.startsWith("video");
		const mediaType: "image" | "video" = isVideo ? "video" : "image";
		const previewUrl = URL.createObjectURL(file);

		const newUploading: UploadingFile = {
			id: tempId,
			file,
			previewUrl,
			mediaType,
			progress: 0,
		};

		setUploadingFiles((prev) => [...prev, newUploading]);

		try {
			const formData = new FormData();
			formData.append("media", file);

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const result = await res.json();

			if (!res.ok || !result.success || !result.data) {
				throw new Error(result.message || "Gagal mengunggah file media");
			}

			const uploadedAttachment: DisasterAttachmentType = {
				media_url: result.data.media_url,
				media_type: result.data.media_type || mediaType,
				media_preview: result.data.media_preview || previewUrl,
			};

			onChangeRef.current([...valueRef.current, uploadedAttachment]);
			toast.success(`Berhasil mengunggah ${file.name}`);
		} catch (error) {
			console.error("Upload error:", error);
			toast.error(`Gagal mengunggah ${file.name}`, {
				description:
					error instanceof Error
						? error.message
						: "Terjadi kesalahan pada server",
			});
		} finally {
			setUploadingFiles((prev) => prev.filter((f) => f.id !== tempId));
		}
	}, []);

	const handleFiles = useCallback(
		(files: FileList | null) => {
			if (!files || files.length === 0 || disabled) return;

			const validFiles: File[] = [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
					// Max size limit: 500MB
					if (file.size > 500 * 1024 * 1024) {
						toast.error(`File ${file.name} melebihi batas 500MB`);
						continue;
					}
					validFiles.push(file);
				} else {
					toast.error(
						`Format ${file.name} tidak didukung (hanya gambar/video)`,
					);
				}
			}

			for (const file of validFiles) {
				uploadFile(file);
			}
		},
		[disabled, uploadFile],
	);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!disabled) setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		if (!disabled) {
			handleFiles(e.dataTransfer.files);
		}
	};

	const handleRemove = (indexToRemove: number) => {
		onChange(value.filter((_, idx) => idx !== indexToRemove));
	};

	return (
		<div className="space-y-4">
			{/* Dropzone Area */}
			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					"relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all",
					isDragging
						? "border-primary bg-primary/5 scale-[1.01]"
						: "border-border bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/30",
					disabled && "pointer-events-none opacity-60",
				)}
			>
				<input
					type="file"
					multiple
					accept="image/*,video/*"
					disabled={disabled}
					onChange={(e) => handleFiles(e.target.files)}
					className="absolute inset-0 cursor-pointer opacity-0"
					id="media-file-input"
				/>

				<div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<UploadCloud className="size-6 text-primary" />
				</div>

				<div className="mt-3 space-y-1">
					<p className="text-sm font-semibold text-foreground">
						Tarik & letakkan foto/video di sini, atau{" "}
						<span className="text-primary underline">pilih file</span>
					</p>
					<p className="text-xs text-muted-foreground">
						Mendukung format PNG, JPG, WEBP, MP4, MOV (Maksimal 500MB per file)
					</p>
				</div>
			</div>

			{/* Uploading Status / Previews Grid */}
			{(value.length > 0 || uploadingFiles.length > 0) && (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
					{/* Completed Uploads */}
					{value.map((att, idx) => {
						const isVideo = att.media_type === "video";
						const displayUrl = att.media_preview || att.media_url;

						return (
							<div
								key={`uploaded-${idx}`}
								className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-border bg-muted"
								onClick={() =>
									setPreviewModal({
										isOpen: true,
										src: displayUrl,
										mediaType: att.media_type,
										title: `Bukti ${idx + 1}`,
									})
								}
							>
								{isVideo ? (
									<>
										<video
											src={displayUrl}
											className="h-full w-full object-cover"
											muted
											playsInline
											preload="metadata"
										/>
										<div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all group-hover:bg-black/35">
											<div className="flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-xs transition-transform group-hover:scale-110">
												<Play
													className="size-4 translate-x-0.5 text-primary"
													fill="currentColor"
												/>
											</div>
										</div>
									</>
								) : (
									<>
										<img
											src={displayUrl}
											alt={`Bukti ${idx + 1}`}
											className="h-full w-full object-cover transition-transform group-hover:scale-105"
										/>
										<div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/25 group-hover:opacity-100">
											<div className="flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-xs">
												<Maximize2 className="size-4" />
											</div>
										</div>
									</>
								)}

								<div className="absolute top-1.5 left-1.5 z-10">
									<Badge
										variant="secondary"
										className="gap-1 bg-background/80 text-[10px] backdrop-blur-xs"
									>
										{isVideo ? (
											<>
												<Film className="size-3" /> Video
											</>
										) : (
											<>
												<ImageIcon className="size-3" /> Foto
											</>
										)}
									</Badge>
								</div>

								<Button
									type="button"
									variant="destructive"
									size="icon"
									onClick={(e) => {
										e.stopPropagation();
										handleRemove(idx);
									}}
									disabled={disabled}
									className="absolute top-1.5 right-1.5 z-10 size-7 opacity-80 transition-opacity hover:opacity-100"
								>
									<Trash2 className="size-3.5" />
								</Button>
							</div>
						);
					})}

					{/* In-Progress Uploads */}
					{uploadingFiles.map((uploading) => (
						<div
							key={uploading.id}
							className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/60 p-2 text-center"
						>
							<Loader2 className="size-6 animate-spin text-primary" />
							<p className="mt-1 line-clamp-1 max-w-[90%] text-[10px] font-medium text-foreground">
								{uploading.file.name}
							</p>
							<span className="text-[9px] text-muted-foreground">
								Mengunggah...
							</span>
						</div>
					))}
				</div>
			)}

			{/* Full resolution popup preview modal */}
			<MediaPreviewModal
				isOpen={previewModal.isOpen}
				onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
				src={previewModal.src}
				mediaType={previewModal.mediaType}
				title={previewModal.title}
			/>
		</div>
	);
}
