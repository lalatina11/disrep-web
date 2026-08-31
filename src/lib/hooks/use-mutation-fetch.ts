// hooks/use-mutation-fetch.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clientFetch from "#/lib/client-fetch";
import type { ApiResponseType } from "#/lib/types";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationOptions<TData, TVariables> {
	method: HttpMethod;
	path: string | ((variables: TVariables) => string); // ← support dynamic paths
	invalidates?: string[]; // ← queryKeys to invalidate after success
	onSuccess?: (data: ApiResponseType<TData>) => void;
	onError?: (error: Error) => void;
}

export function useMutationFetch<
	TData,
	TVariables extends Record<string, unknown>,
>({
	method,
	path,
	invalidates = [],
	onSuccess,
	onError,
}: MutationOptions<TData, TVariables>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (variables: TVariables) => {
			const resolvedPath = typeof path === "function" ? path(variables) : path;
			return clientFetch<TData>(resolvedPath, method, variables);
		},
		onSuccess: (data) => {
			// Invalidate related queries after mutation
			invalidates.forEach((key) => {
				queryClient.invalidateQueries({ queryKey: [key] });
			});
			onSuccess?.(data);
		},
		onError,
	});
}
