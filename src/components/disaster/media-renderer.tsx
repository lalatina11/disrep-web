import {
	Download,
	ExternalLink,
	Film,
	Image as ImageIcon,
	Maximize2,
	Play,
	X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { cn } from "#/lib/utils";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v", ".mkv"];

export function isVideo(mediaType?: string, url?: string): boolean {
	if (mediaType?.toLowerCase() === "video") return true;
	if (mediaType?.toLowerCase() === "image") return false;
	if (url) {
		const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();
		return VIDEO_EXTENSIONS.some((ext) => cleanUrl.endsWith(ext));
	}
	return false;
}

interface MediaPreviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	src: string;
	mediaType?: string;
	title?: string;
}

export function MediaPreviewModal({
	isOpen,
	onClose,
	src,
	mediaType,
	title = "Pratinjau Media",
}: MediaPreviewModalProps) {
	const isVideoType = isVideo(mediaType, src);

	const handleDownload = async () => {
		try {
			const res = await fetch(src);
			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = src.split("/").pop() || "media-download";
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch {
			window.open(src, "_blank");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[95vh] max-w-[95vw] flex-col items-center justify-center border-none bg-transparent p-0 shadow-none sm:max-w-5xl"
			>
				{/* Top bar */}
				<div className="flex w-full items-center justify-between gap-3 rounded-t-xl bg-black/60 px-4 py-2.5 text-white backdrop-blur-md">
					<div className="flex items-center gap-2">
						<Badge
							variant="secondary"
							className="gap-1 bg-white/20 text-white backdrop-blur-xs"
						>
							{isVideoType ? (
								<>
									<Film className="size-3.5" /> Video
								</>
							) : (
								<>
									<ImageIcon className="size-3.5" /> Foto
								</>
							)}
						</Badge>
						<DialogHeader>
							<DialogTitle className="line-clamp-1 text-sm font-medium text-white/90">
								{title}
							</DialogTitle>
						</DialogHeader>
					</div>

					<div className="flex items-center gap-1.5">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={handleDownload}
							title="Unduh File"
							className="text-white hover:bg-white/20 hover:text-white"
						>
							<Download className="size-4" />
							<span className="sr-only">Unduh</span>
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							asChild
							title="Buka di Tab Baru"
							className="text-white hover:bg-white/20 hover:text-white"
						>
							<a href={src} target="_blank" rel="noreferrer">
								<ExternalLink className="size-4" />
								<span className="sr-only">Tab Baru</span>
							</a>
						</Button>
						<DialogClose asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								className="text-white hover:bg-white/20 hover:text-white"
								title="Tutup (Esc)"
							>
								<X className="size-4.5" />
								<span className="sr-only">Tutup</span>
							</Button>
						</DialogClose>
					</div>
				</div>

				{/* Full-resolution media container */}
				<div className="relative flex max-h-[80vh] w-full items-center justify-center overflow-hidden rounded-b-xl border border-white/10 bg-black/80 shadow-2xl">
					{isVideoType ? (
						<video
							src={src}
							controls
							autoPlay
							playsInline
							className="max-h-[78vh] max-w-full rounded-b-xl object-contain"
						/>
					) : (
						<img
							src={src}
							alt={title}
							className="max-h-[78vh] max-w-full rounded-b-xl object-contain select-none"
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface MediaRendererProps {
	src: string;
	mediaType?: string;
	alt?: string;
	className?: string;
	controls?: boolean;
	autoPlay?: boolean;
	muted?: boolean;
	loop?: boolean;
	showBadge?: boolean;
	enablePreview?: boolean;
}

export function MediaRenderer({
	src,
	mediaType,
	alt = "Lampiran media",
	className,
	controls = true,
	autoPlay = false,
	muted = true,
	loop = false,
	showBadge = false,
	enablePreview = true,
}: MediaRendererProps) {
	const [isFallbackVideo, setIsFallbackVideo] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const isVideoType = isVideo(mediaType, src) || isFallbackVideo;

	return (
		<>
			<div
				className={cn(
					"group relative h-full w-full overflow-hidden",
					enablePreview && "cursor-pointer",
					className,
				)}
				onClick={() => {
					if (enablePreview) {
						setIsPreviewOpen(true);
					}
				}}
			>
				{isVideoType ? (
					<>
						<video
							src={src}
							controls={!enablePreview && controls}
							autoPlay={autoPlay}
							muted={muted}
							loop={loop}
							playsInline
							preload="metadata"
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						{enablePreview && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-200 group-hover:bg-black/35">
								<div className="flex size-11 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-xs transition-transform duration-200 group-hover:scale-110">
									<Play className="size-5 translate-x-0.5 text-primary" fill="currentColor" />
								</div>
							</div>
						)}
					</>
				) : (
					<>
						<img
							src={src}
							alt={alt}
							loading="lazy"
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							onError={() => {
								if (!mediaType) {
									setIsFallbackVideo(true);
								}
							}}
						/>
						{enablePreview && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/25 group-hover:opacity-100">
								<div className="flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-xs">
									<Maximize2 className="size-4" />
								</div>
							</div>
						)}
					</>
				)}

				{showBadge && (
					<div className="pointer-events-none absolute bottom-2 left-2 z-10">
						<Badge
							variant="secondary"
							className="gap-1 bg-background/80 text-[10px] backdrop-blur-xs"
						>
							{isVideoType ? (
								<>
									<Film className="size-3" /> Video
								</>
							) : (
								"Foto"
							)}
						</Badge>
					</div>
				)}
			</div>

			{/* Full resolution popup modal */}
			{enablePreview && (
				<MediaPreviewModal
					isOpen={isPreviewOpen}
					onClose={() => setIsPreviewOpen(false)}
					src={src}
					mediaType={mediaType}
					title={alt}
				/>
			)}
		</>
	);
}

export function MediaThumbnail({
	src,
	mediaType,
	alt = "Bukti Bantuan",
	className,
}: {
	src: string;
	mediaType?: string;
	alt?: string;
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const isVideoType = isVideo(mediaType, src);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className={cn(
					"group relative block size-16 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border bg-muted text-left transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
					className,
				)}
			>
				{isVideoType ? (
					<div className="relative flex h-full w-full items-center justify-center bg-muted">
						<video
							src={src}
							preload="metadata"
							className="h-full w-full object-cover opacity-80 group-hover:opacity-100"
						/>
						<div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/10">
							<Play
								className="size-5 text-white drop-shadow-sm"
								fill="currentColor"
							/>
						</div>
					</div>
				) : (
					<img
						src={src}
						alt={alt}
						loading="lazy"
						className="h-full w-full object-cover transition-transform group-hover:scale-110"
					/>
				)}
			</button>

			<MediaPreviewModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				src={src}
				mediaType={mediaType}
				title={alt}
			/>
		</>
	);
}
