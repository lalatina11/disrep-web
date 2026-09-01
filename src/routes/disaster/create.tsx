import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	AlertTriangle,
	ArrowLeft,
	Eye,
	EyeOff,
	Info,
	MapPin,
	Send,
	Upload,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { MapPicker } from "#/components/forms/disaster/map-picker";
import { MediaDropzone } from "#/components/forms/disaster/media-dropzone";
import MainLayout from "#/components/layouts/main-layout";
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
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import { Spinner } from "#/components/ui/spinner";
import { Textarea } from "#/components/ui/textarea";
import { useCreateDisasterMutation } from "#/lib/hooks/disaster";
import {
	createDisasterSchema,
	type CreateDisasterSchemaType,
} from "#/lib/validations/disaster";

export const Route = createFileRoute("/disaster/create")({
	component: CreateDisasterPage,
});

function CreateDisasterPage() {
	const navigate = useNavigate();
	const createMutation = useCreateDisasterMutation();

	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<CreateDisasterSchemaType>({
		resolver: zodResolver(createDisasterSchema),
		defaultValues: {
			title: "",
			description: "",
			city: "",
			street: "",
			lat: -7.4243772,
			lng: 109.2301616,
			is_anon: false,
			attachment: [],
		},
	});

	const isAnon = watch("is_anon");
	const latValue = watch("lat");
	const lngValue = watch("lng");
	const attachmentValue = watch("attachment");

	const onSubmit = (data: CreateDisasterSchemaType) => {
		// Clean payload: strip temporary media_preview before sending to backend
		const payload: CreateDisasterSchemaType = {
			...data,
			attachment: data.attachment.map(({ media_url, media_type }) => ({
				media_url,
				media_type,
			})),
		};

		createMutation.mutate(payload, {
			onSuccess: (result) => {
				if (result && "id" in result) {
					navigate({ to: "/disaster/$id", params: { id: result.id } });
				} else {
					navigate({ to: "/" });
				}
			},
		});
	};

	const isLoading = isSubmitting || createMutation.isPending;

	return (
		<MainLayout>
			<div className="container mx-auto max-w-4xl px-4 py-8">
				{/* Top Navigation */}
				<div className="mb-6 flex items-center justify-between">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/">
							<ArrowLeft className="size-4" />
							Kembali ke Beranda
						</Link>
					</Button>
					<Badge variant="outline" className="gap-1.5 py-1">
						<AlertTriangle className="size-3 text-destructive" />
						Laporan Darurat
					</Badge>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					<Card>
						<CardHeader className="pb-4">
							<CardTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
								Buat Laporan Bencana Baru
							</CardTitle>
							<CardDescription>
								Lengkapi informasi bencana, titik koordinat lokasi, dan unggah bukti foto/video kejadian.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							<FieldGroup>
								{/* Judul Laporan */}
								<Field>
									<FieldLabel htmlFor="title">Judul Laporan Bencana *</FieldLabel>
									<Input
										id="title"
										placeholder="Contoh: Banjir Bandang di Kawasan Pemukiman Warga"
										disabled={isLoading}
										{...register("title")}
									/>
									<FieldDescription>
										Berikan judul singkat dan jelas mengenai kejadian bencana
									</FieldDescription>
									<FieldError errors={[{ message: errors.title?.message }]} />
								</Field>

								{/* Deskripsi */}
								<Field>
									<FieldLabel htmlFor="description">Deskripsi Kejadian *</FieldLabel>
									<Textarea
										id="description"
										rows={4}
										placeholder="Jelaskan kondisi saat ini, dampak bencana, korban terdampak, atau kebutuhan bantuan darurat..."
										disabled={isLoading}
										{...register("description")}
									/>
									<FieldError errors={[{ message: errors.description?.message }]} />
								</Field>

								<Separator />

								{/* Informasi Lokasi (Kota & Alamat) */}
								<div className="space-y-4">
									<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
										<MapPin className="size-4 text-primary" />
										<span>Lokasi Kejadian</span>
									</div>

									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<Field>
											<FieldLabel htmlFor="city">Kota / Kabupaten *</FieldLabel>
											<Input
												id="city"
												placeholder="Contoh: Banyumas / Purwokerto"
												disabled={isLoading}
												{...register("city")}
											/>
											<FieldError errors={[{ message: errors.city?.message }]} />
										</Field>

										<Field>
											<FieldLabel htmlFor="street">Alamat Lengkap / Nama Jalan *</FieldLabel>
											<Input
												id="street"
												placeholder="Contoh: Jalan Jenderal Sudirman No. 45"
												disabled={isLoading}
												{...register("street")}
											/>
											<FieldError errors={[{ message: errors.street?.message }]} />
										</Field>
									</div>

									{/* Map Coordinates Picker */}
									<Field>
										<FieldLabel>Titik Koordinat Bencana (Peta) *</FieldLabel>
										<MapPicker
											lat={latValue}
											lng={lngValue}
											disabled={isLoading}
											onChange={({ lat, lng }) => {
												setValue("lat", lat, { shouldValidate: true });
												setValue("lng", lng, { shouldValidate: true });
											}}
										/>
										<FieldError
											errors={[
												{ message: errors.lat?.message },
												{ message: errors.lng?.message },
											]}
										/>
									</Field>
								</div>

								<Separator />

								{/* Media Attachments Uploader */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
											<Upload className="size-4 text-primary" />
											<span>Bukti Foto & Video Kejadian *</span>
										</div>
										<span className="text-xs text-muted-foreground">
											{attachmentValue?.length || 0} media terunggah
										</span>
									</div>

									<Controller
										control={control}
										name="attachment"
										render={({ field }) => (
											<MediaDropzone
												value={field.value}
												onChange={field.onChange}
												disabled={isLoading}
											/>
										)}
									/>
									<FieldError errors={[{ message: errors.attachment?.message }]} />
								</div>

								<Separator />

								{/* Opsi Pelapor Anonim */}
								<div className="flex items-start justify-between rounded-xl border border-border bg-muted/20 p-4">
									<div className="space-y-1">
										<div className="flex items-center gap-2 font-medium text-sm text-foreground">
											{isAnon ? (
												<EyeOff className="size-4 text-primary" />
											) : (
												<Eye className="size-4 text-muted-foreground" />
											)}
											<span>Laporkan Secara Anonim</span>
										</div>
										<p className="text-xs text-muted-foreground">
											Identitas nama dan profil akun Anda tidak akan ditampilkan kepada publik pada laporan ini.
										</p>
									</div>

									<label
										htmlFor="is_anon_toggle"
										className="relative inline-flex cursor-pointer items-center"
									>
										<input
											id="is_anon_toggle"
											type="checkbox"
											className="peer sr-only"
											disabled={isLoading}
											{...register("is_anon")}
										/>
										<div className="h-6 w-11 rounded-full bg-input transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
									</label>
								</div>
							</FieldGroup>

							{/* Info Note */}
							<div className="flex items-start gap-2.5 rounded-lg border border-border/80 bg-card p-3.5 text-xs text-muted-foreground">
								<Info className="size-4 shrink-0 text-primary" />
								<p className="leading-relaxed">
									Pastikan semua data yang dilaporkan akurat dan dapat dipertanggungjawabkan untuk mempercepat proses verifikasi dan penyaluran bantuan oleh relawan dan pihak terkait.
								</p>
							</div>

							{/* Actions */}
							<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
								<Button
									type="button"
									variant="outline"
									disabled={isLoading}
									asChild
								>
									<Link to="/">Batal</Link>
								</Button>

								<Button
									type="submit"
									disabled={isLoading}
									className="gap-2 min-w-40"
								>
									{isLoading ? (
										<>
											<Spinner className="size-4" />
											<span>Mengirim Laporan...</span>
										</>
									) : (
										<>
											<Send className="size-4" />
											<span>Kirim Laporan Bencana</span>
										</>
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				</form>
			</div>
		</MainLayout>
	);
}
