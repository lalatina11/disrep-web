import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import clientFetch from "../client-fetch";
import queryClient, { type MutationConfig } from "../query-client";
import type { DisasterReport } from "../types";
import type {
	CreateDisasterSchemaType,
	UpdateDisasterStatusSchemaType,
} from "../validations/disaster";

export const useCreateDisasterMutation = (
	config?: MutationConfig<
		(data: CreateDisasterSchemaType) => Promise<DisasterReport["disaster"]>
	>,
) => {
	return useMutation({
		...config,
		mutationFn: (data: CreateDisasterSchemaType) => {
			return clientFetch<DisasterReport["disaster"]>("disaster", "POST", data);
		},
		onSuccess: (data, variables, onMutateResult, context) => {
			queryClient.invalidateQueries({ queryKey: ["disaster"] });
			toast.success("Laporan bencana berhasil dibuat", {
				description:
					data.status === "pending"
						? "Laporanmu akan ditinjau admin"
						: undefined,
			});
			config?.onSuccess?.(data, variables, onMutateResult, context);
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error("Gagal melaporkan bencana alam");
			config?.onError?.(error, variables, onMutateResult, context);
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

export const useDeleteDisasterMutation = (afterDeletionFn: () => void) => {
	return useMutation({
		mutationFn: ({ disasterId }: { disasterId: string }) => {
			return clientFetch(`disaster/${disasterId}`, "DELETE");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["disaster"],
			});
			toast.success("Berhasil menghapus data bencana");
			afterDeletionFn();
		},
		onError: (error) => {
			console.log({ error });

			toast.error(
				error instanceof Error ? error.message : "Gagal menghapus data bencana",
			);
		},
	});
};
