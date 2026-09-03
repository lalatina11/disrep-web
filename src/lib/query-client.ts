/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { QueryClient, type UseMutationOptions } from "@tanstack/react-query";
import clientFetch from "./client-fetch";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: ({ queryKey }) => {
				const [url, params] = queryKey as [string, Record<string, unknown>?];

				const fullUrl = params
					? `${url}?${new URLSearchParams(params as Record<string, string>).toString()}`
					: url;
				return clientFetch(fullUrl, "GET");
			},
			retry: false,
			staleTime: 1000 * 60,
		},
	},
});

export default queryClient;

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
	Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
	ReturnType<T>,
	"queryKey" | "queryFn"
>;

export type MutationConfig<
	MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
	ApiFnReturnType<MutationFnType>,
	Error,
	Parameters<MutationFnType>[0]
>;
