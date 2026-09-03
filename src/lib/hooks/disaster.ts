import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import clientFetch from "../client-fetch";
import queryClient from "../query-client";
import type { DisasterReport } from "../types";
import type {
	CreateDisasterSchemaType,
	UpdateDisasterStatusSchemaType,
} from "../validations/disaster";

export const useCreateDisasterMutation = () => {
	return useMutation({
		mutationFn: (data: CreateDisasterSchemaType) => {
			return clientFetch<DisasterReport["disaster"]>("disaster", "POST", data);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["disaster"] });
			toast.success("Laporan bencana berhasil dibuat", {
				description:
					data.status === "pending"
						? "Laporanmu akan ditinjau admin"
						: undefined,
			});
		},
		onError: () => {
			toast.error("Gagal melaporkan bencana alam");
		},
	});
};

export const useUpdateDisasterStatusMutation = () => {
	return useMutation({
		mutationFn: ({
			disaster_id,
			data,
		}: {
			disaster_id: string;
			data: UpdateDisasterStatusSchemaType;
		}) => {
			return clientFetch<DisasterReport>(
				`disaster/${disaster_id}/status`,
				"PATCH",
				data,
			);
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({
				queryKey: [`disaster/${result.disaster.id}`],
			});
			queryClient.invalidateQueries({
				queryKey: ["disaster"],
			});
			toast.success("Berhasil mengubah status bencana");
		},
		onError: (error) => {
			console.log({ error });

			toast.error(
				error instanceof Error
					? error.message
					: "Gagal mengubah status bencana",
			);
		},
	});
};

export const useDeleteDisasterMutation = () => {
	return useMutation({
		mutationFn: ({ disasterId }: { disasterId: string }) => {
			return clientFetch(`disaster/${disasterId}`, "DELETE");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["disaster"],
			});
			toast.success("Berhasil menghapus data bencana");
		},
		onError: (error) => {
			console.log({ error });

			toast.error(
				error instanceof Error ? error.message : "Gagal menghapus data bencana",
			);
		},
	});
};
