import { zodResolver } from "@hookform/resolvers/zod";
import { Coins, Loader2, PackagePlus, Plus, Receipt, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { MediaDropzone } from "#/components/forms/disaster/media-dropzone";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import { formatRupiah } from "#/lib/common";
import { useCreateDisasterAid } from "#/lib/hooks/disaster-aid";
import useUserStore from "#/lib/stores/use-user-store";
import {
	createDisasterAidSchema,
	type CreateDisasterAidSchemaType,
} from "#/lib/validations/disaster-aid";

interface CreateDisasterAidDialogProps {
	disasterId: string;
	trigger?: React.ReactNode;
}

export function CreateDisasterAidDialog({
	disasterId,
	trigger,
}: CreateDisasterAidDialogProps) {
	const { isAdmin } = useUserStore();
	const [isOpen, setIsOpen] = useState(false);
	const createAidMutation = useCreateDisasterAid();

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<CreateDisasterAidSchemaType>({
		resolver: zodResolver(createDisasterAidSchema),
		defaultValues: {
			disaster_id: disasterId,
			items: [{ item_name: "", item_price: 0, quantity: 1 }],
			attachments: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	// Only render button for admins
	if (!isAdmin()) {
		return null;
	}

	const watchedItems = watch("items") || [];
	const grandTotal = watchedItems.reduce((sum, item) => {
		const price = Number(item?.item_price) || 0;
		const qty = Number(item?.quantity) || 0;
		return sum + price * qty;
	}, 0);

	const onSubmit = (data: CreateDisasterAidSchemaType) => {
		// Clean payload: strip media_preview before sending to backend
		const payload: CreateDisasterAidSchemaType = {
			...data,
			disaster_id: disasterId,
			attachments: data.attachments.map(({ media_url, media_type }) => ({
				media_url,
				media_type,
			})),
		};

		createAidMutation.mutate(payload, {
			onSuccess: () => {
				reset();
				setIsOpen(false);
			},
		});
	};

	const isLoading = isSubmitting || createAidMutation.isPending;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button size="sm" className="gap-1.5 shadow-xs">
						<PackagePlus className="size-4" />
						<span>Tambah Bantuan</span>
					</Button>
				)}
			</DialogTrigger>

			<DialogContent
				className="max-h-[90vh] w-full max-w-2xl overflow-y-auto sm:max-w-2xl"
				showCloseButton={!isLoading}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-lg font-bold">
						<PackagePlus className="size-5 text-primary" />
						Catat Distribusi Bantuan
					</DialogTitle>
					<DialogDescription>
						Tambahkan rincian barang logistik yang disalurkan dan unggah bukti dokumentasi atau nota serah terima.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
					{/* Daftar Barang Logistik */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
								<Coins className="size-4 text-primary" />
								<span>Daftar Barang Bantuan *</span>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isLoading}
								onClick={() =>
									append({ item_name: "", item_price: 0, quantity: 1 })
								}
								className="h-8 gap-1 text-xs"
							>
								<Plus className="size-3.5" />
								Tambah Barang
							</Button>
						</div>

						<div className="space-y-3">
							{fields.map((field, index) => {
								const currentPrice = Number(watchedItems[index]?.item_price) || 0;
								const currentQty = Number(watchedItems[index]?.quantity) || 0;
								const subtotal = currentPrice * currentQty;

								return (
									<div
										key={field.id}
										className="relative rounded-lg border border-border bg-muted/20 p-3 text-xs"
									>
										<div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
											{/* Nama Barang */}
											<div className="sm:col-span-5">
												<Field>
													<FieldLabel className="text-xs">
														Nama Barang #{index + 1} *
													</FieldLabel>
													<Input
														placeholder="Contoh: Beras 5kg, Selimut"
														disabled={isLoading}
														{...register(`items.${index}.item_name`)}
														className="h-9 text-xs"
													/>
												</Field>
											</div>

											{/* Jumlah */}
											<div className="sm:col-span-3">
												<Field>
													<FieldLabel className="text-xs">Jumlah *</FieldLabel>
													<Input
														type="number"
														min={1}
														placeholder="1"
														disabled={isLoading}
														{...register(`items.${index}.quantity`)}
														className="h-9 text-xs"
													/>
												</Field>
											</div>

											{/* Harga per Unit */}
											<div className="sm:col-span-3">
												<Field>
													<FieldLabel className="text-xs">
														Harga Satuan (Rp) *
													</FieldLabel>
													<Input
														type="number"
														min={0}
														step={500}
														placeholder="0"
														disabled={isLoading}
														{...register(`items.${index}.item_price`)}
														className="h-9 text-xs"
													/>
												</Field>
											</div>

											{/* Hapus Baris */}
											<div className="flex justify-end sm:col-span-1">
												<Button
													type="button"
													variant="ghost"
													size="icon"
													disabled={isLoading || fields.length <= 1}
													onClick={() => remove(index)}
													className="size-9 text-muted-foreground hover:text-destructive"
													title="Hapus baris"
												>
													<Trash2 className="size-4" />
												</Button>
											</div>
										</div>

										{/* Subtotal Preview */}
										<div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
											<span>Subtotal:</span>
											<span className="font-semibold text-foreground">
												{formatRupiah(subtotal)}
											</span>
										</div>

										{/* Validation errors for this row */}
										{errors.items?.[index] && (
											<div className="mt-1.5 space-y-0.5 text-[11px] text-destructive">
												{errors.items[index]?.item_name?.message && (
													<p>{errors.items[index]?.item_name?.message}</p>
												)}
												{errors.items[index]?.quantity?.message && (
													<p>{errors.items[index]?.quantity?.message}</p>
												)}
												{errors.items[index]?.item_price?.message && (
													<p>{errors.items[index]?.item_price?.message}</p>
												)}
											</div>
										)}
									</div>
								);
							})}

							{errors.items?.message && (
								<FieldError errors={[{ message: errors.items.message }]} />
							)}
						</div>

						{/* Total Ringkasan */}
						<div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-2.5 text-sm">
							<span className="font-medium text-foreground">
								Total Estimasi Nilai Bantuan:
							</span>
							<Badge variant="default" className="text-sm font-bold">
								{formatRupiah(grandTotal)}
							</Badge>
						</div>
					</div>

					<Separator />

					{/* Bukti & Dokumentasi Bantuan */}
					<div className="space-y-3">
						<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
							<Receipt className="size-4 text-primary" />
							<span>Bukti & Dokumentasi Bantuan (Foto/Video) *</span>
						</div>

						<Controller
							control={control}
							name="attachments"
							render={({ field }) => (
								<MediaDropzone
									value={field.value}
									onChange={field.onChange}
									disabled={isLoading}
								/>
							)}
						/>
						{errors.attachments?.message && (
							<FieldError errors={[{ message: errors.attachments.message }]} />
						)}
					</div>

					{/* Actions */}
					<div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant="outline"
							disabled={isLoading}
							onClick={() => setIsOpen(false)}
						>
							Batal
						</Button>

						<Button type="submit" disabled={isLoading} className="gap-2">
							{isLoading ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									<span>Menyimpan Bantuan...</span>
								</>
							) : (
								<>
									<PackagePlus className="size-4" />
									<span>Simpan Data Bantuan</span>
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
