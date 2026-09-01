import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { formatShortDate, getStatusBadge } from "#/lib/common";
import type { DisasterReport } from "#/lib/types/disaster-types";
import { MediaRenderer } from "./media-renderer";

export const DisasterCard = ({ report }: { report: DisasterReport }) => {
	const { disaster, attachments, author, aids } = report;
	const firstAttachment = attachments?.[0];
	const statusBadge = getStatusBadge(disaster.status);
	const formattedDate = formatShortDate(disaster.created_at);

	return (
		<Link to="/disaster/$id" params={{ id: disaster.id }}>
			<Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
				<div className="relative aspect-video w-full overflow-hidden bg-muted">
					{firstAttachment ? (
						<MediaRenderer
							src={firstAttachment.media_url}
							mediaType={firstAttachment.media_type}
							alt={disaster.title}
							controls={false}
							showBadge
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-muted-foreground">
							<MapPin className="size-8 opacity-40" />
						</div>
					)}
					<div className="absolute top-2 right-2 z-10">
						<Badge variant={statusBadge.variant} className="shadow-xs">
							{statusBadge.label}
						</Badge>
					</div>
				</div>

				<CardHeader className="p-3 pb-1">
					<CardTitle className="line-clamp-1 text-sm font-semibold">
						{disaster.title}
					</CardTitle>
					<div className="flex items-center gap-1 text-xs text-muted-foreground">
						<MapPin className="size-3 shrink-0" />
						<span className="line-clamp-1">
							{disaster.city ? `${disaster.city}, ` : ""}
							{disaster.street || "Lokasi tidak disebutkan"}
						</span>
					</div>
				</CardHeader>

				<CardContent className="flex-1 p-3 pt-1">
					<CardDescription className="line-clamp-2 text-xs">
						{disaster.description || "Tidak ada deskripsi."}
					</CardDescription>
					{aids && aids.length > 0 && (
						<div className="mt-2 flex items-center gap-1 text-xs text-primary">
							<Package className="size-3" />
							<span>{aids.length} Paket Bantuan</span>
						</div>
					)}
				</CardContent>

				<CardFooter className="flex items-center justify-between border-t border-border p-3 pt-2 text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<Avatar size="sm" className="size-5">
							{!disaster.is_anon && author?.avatar && (
								<AvatarImage src={author.avatar} alt={author.display_name} />
							)}
							<AvatarFallback className="text-[10px]">
								{disaster.is_anon
									? "AN"
									: (author?.display_name?.slice(0, 2).toUpperCase() ?? "U")}
							</AvatarFallback>
						</Avatar>
						<span className="line-clamp-1 max-w-22.5 text-xs font-medium text-foreground">
							{disaster.is_anon
								? "Anonim"
								: (author?.display_name ?? "Pengguna")}
						</span>
					</div>
					<div className="flex items-center gap-1 text-[11px]">
						<Calendar className="size-3" />
						<span>{formattedDate}</span>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
};

export const DisasterCardSkeleton = () => {
	return (
		<Card className="flex h-full flex-col overflow-hidden">
			<Skeleton className="aspect-video w-full rounded-none" />
			<div className="flex flex-col gap-2 p-3 pb-1">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
			<div className="flex-1 p-3 pt-1 space-y-1.5">
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-4/5" />
			</div>
			<div className="flex items-center justify-between border-t border-border p-3 pt-2">
				<div className="flex items-center gap-1.5">
					<Skeleton className="size-5 rounded-full" />
					<Skeleton className="h-3 w-14" />
				</div>
				<Skeleton className="h-3 w-16" />
			</div>
		</Card>
	);
};
