import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { Spinner } from "#/components/ui/spinner";
import { useDeleteDisasterMutation } from "#/lib/hooks/disaster";
import useUserStore from "#/lib/stores/use-user-store";

interface DeleteDisasterDialogProps {
	disasterId: string;
	disasterTitle: string;
	trigger?: React.ReactNode;
}

export function DeleteDisasterDialog({
	disasterId,
	disasterTitle,
	trigger,
}: DeleteDisasterDialogProps) {
	const { isAdmin } = useUserStore();
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const deleteMutation = useDeleteDisasterMutation();

	// Admin authority gate
	if (!isAdmin()) {
		return null;
	}

	const handleDelete = () => {
		deleteMutation.mutate(
			{ disasterId },
			{
				onSuccess: () => {
					setIsOpen(false);
					navigate({ to: "/" });
				},
			},
		);
	};

	const isLoading = deleteMutation.isPending;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!isLoading) {
					setIsOpen(open);
				}
			}}
		>
			<DialogTrigger asChild>
				{trigger || (
					<Button
						variant="outline"
						size="sm"
						className="h-7 gap-1.5 border-destructive/30 px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
					>
						<Trash2 className="size-3" />
						<span>Hapus Laporan</span>
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="sm:max-w-md" showCloseButton={!isLoading}>
				<DialogHeader>
					<div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
						<AlertTriangle className="size-5" />
					</div>
					<DialogTitle className="text-lg font-bold">
						Hapus Laporan Bencana?
					</DialogTitle>
					<DialogDescription className="text-left text-sm leading-normal">
						Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Laporan
						bencana berikut beserta seluruh bukti foto, video, dan logistik
						bantuan terkait akan dihapus:
					</DialogDescription>
				</DialogHeader>

				<div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
					<p className="font-semibold text-foreground line-clamp-2">
						"{disasterTitle}"
					</p>
				</div>

				<DialogFooter className="gap-4">
					<DialogClose asChild>
						<Button type="button" variant="outline" disabled={isLoading}>
							Batal
						</Button>
					</DialogClose>

					<Button
						type="button"
						variant="destructive"
						disabled={isLoading}
						onClick={handleDelete}
						className="gap-2"
					>
						{isLoading ? (
							<>
								<Spinner />
								<span>Menghapus...</span>
							</>
						) : (
							<>
								<Trash2 className="size-4" />
								<span>Ya, Hapus Laporan</span>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
