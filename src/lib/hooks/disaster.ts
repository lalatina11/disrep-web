import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import clientFetch from "../client-fetch";
import queryClient from "../query-client";
import type { DisasterReport } from "../types";
import type { CreateDisasterSchemaType } from "../validations/disaster";

export const useCreateDisasterMutation = () => {
	return useMutation({
		mutationFn: (data: CreateDisasterSchemaType) => {
			return clientFetch<DisasterReport["disaster"]>("disaster", "POST", data);
		},
		onSuccess: ({ status }) => {
			queryClient.invalidateQueries({ queryKey: ["disaster"] });
			toast.success("Laporan bencana berhasil dibuat", {
				description:
					status === "new" ? "Laporanmu akan ditinjau admin" : undefined,
			});
		},
		onError: () => {
			toast.error("Gagal melaporkan bencana alam");
		},
	});
};
