import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import clientFetch from "../client-fetch";
import queryClient from "../query-client";
import type { DisasterReport } from "../types";
import type { CreateDisasterAidSchemaType } from "../validations/disaster-aid";

export const useCreateDisasterAid = () => {
	return useMutation({
		mutationFn: (data: CreateDisasterAidSchemaType) => {
			return clientFetch<DisasterReport>(`disaster-aid`, "POST", data);
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({
				queryKey: [`disaster/${result.disaster.id}`],
			});
			queryClient.invalidateQueries({
				queryKey: ["disaster"],
			});
			toast.success("Berhasil menambahkan data bantuan ke bencana ini");
		},
		onError: (error) => {
			console.log({ error });

			toast.error(
				error instanceof Error
					? error.message
					: "Data bantuan gagal ditambahkan",
			);
		},
	});
};
