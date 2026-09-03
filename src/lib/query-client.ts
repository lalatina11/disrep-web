import { QueryClient } from "@tanstack/react-query";
import clientFetch from "./client-fetch";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: ({ queryKey }) => {
				const [url, params] = queryKey as [string, Record<string, unknown>?];

				const isQueryParamsAvailable = Boolean(params);

				const fullUrl = params
					? `${url}?${isQueryParamsAvailable && new URLSearchParams(params as Record<string, string>).toString()}`
					: url;
				return clientFetch(fullUrl, "GET");
			},
			retry: false,
			staleTime: 1000 * 60,
		},
	},
});

export default queryClient;
