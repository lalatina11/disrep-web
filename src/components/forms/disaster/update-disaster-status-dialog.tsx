import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Edit3, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { FieldError } from "#/components/ui/field";
import { getStatusBadge } from "#/lib/common";
import { useUpdateDisasterStatusMutation } from "#/lib/hooks/disaster";
import useUserStore from "#/lib/stores/use-user-store";
import { DisasterStatus, type DisasterStatusType } from "#/lib/types/enums";
import { cn } from "#/lib/utils";
import {
	type UpdateDisasterStatusSchemaType,
	updateDisasterStatusSchema,
} from "#/lib/validations/disaster";

interface UpdateDisasterStatusDialogProps {
	disasterId: string;
	currentStatus: DisasterStatusType | string;
	trigger?: React.ReactNode;
}

interface StatusOption {
	value: DisasterStatus;
	description: string;
}

const STATUS_OPTIONS: StatusOption[] = [
	{
		value: DisasterStatus.NEW,
		description: "Laporan baru masuk dari warga dan menunggu verifikasi",
	},
	{
		value: DisasterStatus.PENDING,
		description: "Laporan sedang ditinjau dan divalidasi oleh tim penanganan",
	},
	{
		value: DisasterStatus.AID_DISPATCHED,
		description:
			"Logistik atau relawan bantuan sedang dalam perjalanan ke lokasi",
	},
	{
		value: DisasterStatus.AID_ARRIVED,
		description: "Bantuan telah tiba di lokasi bencana dan diserahkan ke warga",
	},
	{
		value: DisasterStatus.RESOLVED,
		description: "Penanganan tanggap darurat bencana telah selesai dituntaskan",
	},
];

export function UpdateDisasterStatusDialog({
	disasterId,
	currentStatus,
	trigger,
}: UpdateDisasterStatusDialogProps) {
	const { isAdmin } = useUserStore();
	const [isOpen, setIsOpen] = useState(false);
	const updateMutation = useUpdateDisasterStatusMutation();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<UpdateDisasterStatusSchemaType>({
		resolver: zodResolver(updateDisasterStatusSchema),
		defaultValues: {
			status: (currentStatus as DisasterStatus) || DisasterStatus.NEW,
		},
	});

	// Only render for admins
	if (!isAdmin()) {
		return null;
	}

	const onSubmit = (data: UpdateDisasterStatusSchemaType) => {
		updateMutation.mutate(
			{
				disaster_id: disasterId,
				data,
			},
			{
				onSuccess: () => {
					setIsOpen(false);
				},
			},
		);
	};

	const isLoading = updateMutation.isPending;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!isLoading) {
					setIsOpen(open);
					if (open) {
						reset({
							status: (currentStatus as DisasterStatus) || DisasterStatus.NEW,
						});
					}
				}
			}}
		>
			<DialogTrigger asChild>
				{trigger || (
					<Button
						variant="outline"
						size="sm"
						className="h-7 gap-1.5 px-2.5 text-xs font-medium shadow-2xs"
					>
						<Edit3 className="size-3 text-primary" />
						<span>Ubah Status</span>
					</Button>
				)}
			</DialogTrigger>

			<DialogContent
				className="w-full max-w-lg sm:max-w-lg"
				showCloseButton={!isLoading}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-lg font-bold">
						<ShieldCheck className="size-5 text-primary" />
						Perbarui Status Bencana
					</DialogTitle>
					<DialogDescription>
						Pilih status terbaru untuk memperbarui progres penanganan bencana
						secara real-time.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
					<Controller
						control={control}
						name="status"
						render={({ field }) => (
							<div className="space-y-2">
								{STATUS_OPTIONS.map((option) => {
									const isSelected = field.value === option.value;
									const badgeInfo = getStatusBadge(option.value);

									return (
										<label
											key={option.value}
											className={cn(
												"relative flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all",
												isSelected
													? "border-primary bg-primary/5 ring-1 ring-primary/30"
													: "border-border bg-card hover:bg-muted/40",
												isLoading && "pointer-events-none opacity-60",
											)}
										>
											<input
												type="radio"
												name="status"
												value={option.value}
												checked={isSelected}
												onChange={() => field.onChange(option.value)}
												className="sr-only"
												disabled={isLoading}
											/>

											<div className="flex-1 space-y-1">
												<div className="flex items-center gap-2">
													<Badge
														variant={badgeInfo.variant}
														className="text-[11px] shadow-2xs"
													>
														{badgeInfo.label}
													</Badge>
													{option.value === currentStatus && (
														<span className="text-[10px] text-muted-foreground">
															(Status Saat Ini)
														</span>
													)}
												</div>
												<p className="text-xs text-muted-foreground">
													{option.description}
												</p>
											</div>

											<div
												className={cn(
													"flex size-5 shrink-0 items-center justify-center rounded-full border transition-all",
													isSelected
														? "border-primary bg-primary text-primary-foreground"
														: "border-muted-foreground/30 bg-transparent",
												)}
											>
												{isSelected && <Check className="size-3 stroke-[3]" />}
											</div>
										</label>
									);
								})}
							</div>
						)}
					/>

					{errors.status?.message && (
						<FieldError errors={[{ message: errors.status.message }]} />
					)}

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
									<span>Memperbarui...</span>
								</>
							) : (
								<>
									<Check className="size-4" />
									<span>Simpan Perubahan</span>
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
