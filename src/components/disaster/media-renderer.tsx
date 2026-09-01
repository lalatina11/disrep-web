import { Film, Play } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
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
}: MediaRendererProps) {
	const [isFallbackVideo, setIsFallbackVideo] = useState(false);
	const isVideoType = isVideo(mediaType, src) || isFallbackVideo;

	return (
		<div className={cn("relative h-full w-full overflow-hidden", className)}>
			{isVideoType ? (
				<video
					src={src}
					controls={controls}
					autoPlay={autoPlay}
					muted={muted}
					loop={loop}
					playsInline
					preload="metadata"
					className="h-full w-full object-cover"
				/>
			) : (
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
			)}

			{showBadge && (
				<div className="pointer-events-none absolute bottom-2 left-2 z-10">
					<Badge variant="secondary" className="gap-1 bg-background/80 text-[10px] backdrop-blur-xs">
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
	const isVideoType = isVideo(mediaType, src);

	return (
		<a
			href={src}
			target="_blank"
			rel="noreferrer"
			className={cn(
				"group relative block size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted",
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
						<Play className="size-5 text-white drop-shadow-sm" fill="currentColor" />
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
		</a>
	);
}
