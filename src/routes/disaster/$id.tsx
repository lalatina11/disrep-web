import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Calendar,
	Clock,
	ExternalLink,
	EyeOff,
	FileText,
	Image as ImageIcon,
	MapPin,
	Package,
	ShieldCheck,
	User,
} from "lucide-react";
import {
	MediaRenderer,
	MediaThumbnail,
} from "#/components/disaster/media-renderer";
import { DeleteDisasterDialog } from "#/components/forms/disaster/delete-disaster-dialog";
import { UpdateDisasterStatusDialog } from "#/components/forms/disaster/update-disaster-status-dialog";
import { CreateDisasterAidDialog } from "#/components/forms/disaster-aid/create-disaster-aid-dialog";
import MainLayout from "#/components/layouts/main-layout";
import NotFound from "#/components/templates/not-found";
import UnexpectedError from "#/components/templates/unexpected-error";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Map as MapCN,
	MapControls,
	MapMarker,
	MarkerContent,
	MarkerPopup,
} from "#/components/ui/map";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { formatDate, formatRupiah, getStatusBadge } from "#/lib/common";
import type { DisasterReport } from "#/lib/types";

export const Route = createFileRoute("/disaster/$id")({
	component: RouteComponent,
});

function DisasterDetailSkeleton() {
	return (
		<MainLayout>
			<div className="container mx-auto max-w-5xl px-4 py-6">
				<Skeleton className="mb-6 h-9 w-36" />
				<div className="space-y-6">
					<div className="space-y-3">
						<div className="flex gap-2">
							<Skeleton className="h-6 w-24 rounded-full" />
							<Skeleton className="h-6 w-32 rounded-full" />
						</div>
						<Skeleton className="h-10 w-3/4" />
						<Skeleton className="h-5 w-1/2" />
					</div>

					<Skeleton className="aspect-video w-full rounded-xl md:aspect-21/9" />

					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div className="space-y-6 md:col-span-2">
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-32" />
								</CardHeader>
								<CardContent className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-2/3" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-40" />
								</CardHeader>
								<CardContent className="space-y-3">
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
								</CardContent>
							</Card>
						</div>
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<Skeleton className="h-5 w-24" />
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-center gap-3">
										<Skeleton className="size-10 rounded-full" />
										<div className="space-y-1">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-16" />
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-5 w-24" />
								</CardHeader>
								<CardContent className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}

function RouteComponent() {
	const params = Route.useParams();

	const { data, isLoading, isError, error, refetch } = useQuery<DisasterReport>(
		{
			queryKey: [`disaster/${params.id}`],
		},
	);

	if (isLoading) {
		return <DisasterDetailSkeleton />;
	}

	if (isError) {
		const errorMessage =
			error instanceof Error ? error.message : "Gagal memuat detail laporan";
		return (
			<MainLayout>
				<UnexpectedError
					error={new Error(errorMessage)}
					reset={() => refetch()}
					title="Gagal Memuat Detail Laporan Bencana"
					description={errorMessage}
				/>
			</MainLayout>
		);
	}

	if (!data || !data.disaster) {
		return (
			<MainLayout>
				<NotFound
					title="Laporan Bencana Tidak Ditemukan"
					description={`Maaf, laporan bencana dengan ID "${params.id}" tidak ditemukan atau telah dihapus.`}
				/>
			</MainLayout>
		);
	}

	const { disaster, attachments, author, aids } = data;
	const statusBadge = getStatusBadge(disaster.status);
	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${disaster.lat},${disaster.lng}`;

	return (
		<MainLayout>
			<div className="container mx-auto max-w-5xl px-4 py-6">
				{/* Back button */}
				<div className="mb-6">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/">
							<ArrowLeft className="size-4" />
							Kembali ke Beranda
						</Link>
					</Button>
				</div>

				<div className="space-y-6">
					{/* Header Information */}
					<div className="space-y-3">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant={statusBadge.variant} className="text-xs">
								{statusBadge.label}
							</Badge>
							<UpdateDisasterStatusDialog
								disasterId={disaster.id}
								currentStatus={disaster.status}
							/>
							<DeleteDisasterDialog
								disasterId={disaster.id}
								disasterTitle={disaster.title}
							/>
							{disaster.is_anon && (
								<Badge variant="outline" className="flex items-center gap-1">
									<EyeOff className="size-3" />
									Laporan Anonim
								</Badge>
							)}
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
							{disaster.title}
						</h1>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
							<div className="flex items-center gap-1">
								<MapPin className="size-4 text-primary" />
								<span>
									{disaster.city ? `${disaster.city}, ` : ""}
									{disaster.street || "Lokasi tidak disebutkan"}
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="size-4" />
								<span>Dibuat: {formatDate(disaster.created_at)}</span>
							</div>
							{disaster.updated_at !== disaster.created_at && (
								<div className="flex items-center gap-1">
									<Clock className="size-4" />
									<span>Diperbarui: {formatDate(disaster.updated_at)}</span>
								</div>
							)}
						</div>
					</div>

					{/* Media Gallery / Attachments */}
					{attachments && attachments.length > 0 ? (
						<div className="space-y-3">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{attachments.map((attachment, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: Attachments don't have unique IDs
										key={`attachment-${index}`}
										className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-muted"
									>
										<MediaRenderer
											src={attachment.media_url}
											mediaType={attachment.media_type}
											alt={`${disaster.title} - Lampiran ${index + 1}`}
											showBadge
										/>
									</div>
								))}
							</div>
						</div>
					) : (
						<div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground md:aspect-21/7">
							<ImageIcon className="size-10 opacity-40" />
							<p className="mt-2 text-sm">
								Tidak ada lampiran foto atau video untuk laporan ini
							</p>
						</div>
					)}

					{/* Content Grid: Main details + Sidebar */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						{/* Left Column (2 cols) */}
						<div className="space-y-6 lg:col-span-2">
							{/* Description Card */}
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-base font-semibold">
										<FileText className="size-4 text-primary" />
										Deskripsi Kejadian
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
										{disaster.description ||
											"Tidak ada deskripsi rinci untuk kejadian ini."}
									</p>
								</CardContent>
							</Card>

							{/* Aids / Bantuan Card */}
							<Card>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2 text-base font-semibold">
											<Package className="size-4 text-primary" />
											Distribusi Bantuan
										</CardTitle>
										<div className="flex items-center gap-2">
											<CreateDisasterAidDialog disasterId={disaster.id} />
											<Badge variant="secondary">
												{aids?.length ?? 0} Paket Bantuan
											</Badge>
										</div>
									</div>
									<CardDescription>
										Daftar logistik dan barang bantuan yang telah dialokasikan
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{aids && aids.length > 0 ? (
										aids.map((aid, aidIndex) => {
											const totalPackageCost = aid.items.reduce(
												(sum, item) => sum + item.item_price * item.quantity,
												0,
											);
											return (
												<div
													key={aid.id}
													className="space-y-3 rounded-lg border border-border bg-muted/20 p-4"
												>
													<div className="flex items-center justify-between">
														<span className="text-sm font-semibold text-foreground">
															Paket Bantuan #{aidIndex + 1}
														</span>
														<span className="text-xs font-semibold text-primary">
															Total: {formatRupiah(totalPackageCost)}
														</span>
													</div>

													{/* Items list */}
													<div className="divide-y divide-border rounded-md border border-border bg-card">
														{aid.items.map((item) => (
															<div
																key={item.id}
																className="flex items-center justify-between p-3 text-xs sm:text-sm"
															>
																<div>
																	<p className="font-medium text-foreground">
																		{item.item_name}
																	</p>
																	<p className="text-xs text-muted-foreground">
																		{formatRupiah(item.item_price)} x{" "}
																		{item.quantity} unit
																	</p>
																</div>
																<span className="font-semibold text-foreground">
																	{formatRupiah(
																		item.item_price * item.quantity,
																	)}
																</span>
															</div>
														))}
													</div>

													{/* Aid Attachments / Receipts */}
													{aid.attachments && aid.attachments.length > 0 && (
														<div className="space-y-1.5 pt-1">
															<p className="text-xs font-medium text-muted-foreground">
																Bukti / Dokumentasi Bantuan:
															</p>
															<div className="flex flex-wrap gap-2">
																{aid.attachments.map((att) => (
																	<MediaThumbnail
																		key={att.id}
																		src={att.media_url}
																		mediaType={att.media_type}
																		alt="Bukti Bantuan"
																	/>
																))}
															</div>
														</div>
													)}
												</div>
											);
										})
									) : (
										<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center text-muted-foreground">
											<Package className="size-8 opacity-40" />
											<p className="mt-2 text-sm font-medium">
												Belum Ada Penyaluran Bantuan
											</p>
											<p className="text-xs text-muted-foreground">
												Laporan ini belum memiliki catatan bantuan logistik atau
												donasi.
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* Right Column (Sidebar, 1 col) */}
						<div className="space-y-6">
							{/* Location & Map Card */}
							<Card className="overflow-hidden">
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-base font-semibold">
										<MapPin className="size-4 text-primary" />
										Informasi Lokasi
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3 text-sm">
									{/* mapcn interactive map */}
									{disaster.lat != null && disaster.lng != null && (
										<div className="relative h-56 w-full overflow-hidden rounded-lg border border-border">
											<MapCN
												viewport={{
													center: [disaster.lng, disaster.lat],
													zoom: 14,
												}}
												className="h-full w-full"
											>
												<MapMarker
													longitude={disaster.lng}
													latitude={disaster.lat}
												>
													<MarkerContent>
														<div className="relative flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-transform hover:scale-110">
															<MapPin className="size-4" />
															<span className="absolute -top-1 -right-1 flex size-2.5">
																<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
																<span className="relative inline-flex size-2.5 rounded-full bg-primary" />
															</span>
														</div>
													</MarkerContent>
													<MarkerPopup closeButton className="max-w-xs">
														<div className="space-y-1">
															<p className="font-semibold text-xs text-foreground">
																{disaster.title}
															</p>
															<p className="text-[11px] text-muted-foreground">
																{disaster.city ? `${disaster.city}, ` : ""}
																{disaster.street || "Lokasi kejadian"}
															</p>
														</div>
													</MarkerPopup>
												</MapMarker>
												<MapControls
													position="bottom-right"
													showZoom
													showLocate
													showCompass
												/>
											</MapCN>
										</div>
									)}

									<div>
										<p className="text-xs text-muted-foreground">
											Kota / Kabupaten
										</p>
										<p className="font-medium text-foreground">
											{disaster.city || "-"}
										</p>
									</div>
									<Separator />
									<div>
										<p className="text-xs text-muted-foreground">
											Alamat Lengkap
										</p>
										<p className="font-medium text-foreground">
											{disaster.street || "Tidak ada detail jalan"}
										</p>
									</div>
									<Separator />
									<div>
										<p className="text-xs text-muted-foreground">
											Titik Koordinat
										</p>
										<p className="font-mono text-xs text-foreground">
											{disaster.lat}, {disaster.lng}
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="w-full"
										asChild
									>
										<a href={mapsUrl} target="_blank" rel="noreferrer">
											<ExternalLink className="size-4" />
											Buka di Google Maps
										</a>
									</Button>
								</CardContent>
							</Card>

							{/* Reporter Info Card */}
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-base font-semibold">
										<User className="size-4 text-primary" />
										Informasi Pelapor
									</CardTitle>
								</CardHeader>
								<CardContent>
									{disaster.is_anon ? (
										<div className="flex items-center gap-3">
											<div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
												<EyeOff className="size-5" />
											</div>
											<div>
												<p className="text-sm font-semibold text-foreground">
													Pelapor Anonim
												</p>
												<p className="text-xs text-muted-foreground">
													Identitas dirahasiakan
												</p>
											</div>
										</div>
									) : author ? (
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<Avatar size="lg">
													{author.avatar && (
														<AvatarImage
															src={author.avatar}
															alt={author.display_name}
														/>
													)}
													<AvatarFallback>
														{author.display_name?.slice(0, 2).toUpperCase() ||
															"U"}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="flex items-center gap-1.5">
														<p className="text-sm font-semibold text-foreground">
															{author.display_name}
														</p>
														{author.role === "admin" && (
															<ShieldCheck className="size-4 text-primary" />
														)}
													</div>
													<p className="text-xs text-muted-foreground">
														{author.email}
													</p>
												</div>
											</div>
											<div className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground">
												<span>Peran Akun</span>
												<Badge variant="outline" className="capitalize text-xs">
													{author.role}
												</Badge>
											</div>
										</div>
									) : (
										<p className="text-xs text-muted-foreground">
											Data pelapor tidak tersedia
										</p>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
