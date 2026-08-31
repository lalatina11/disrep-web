import { QueryClient } from "@tanstack/react-query";
import clientFetch from "./client-fetch";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: ({ queryKey }) => {
				return clientFetch(queryKey[0] as string, "GET");
			},
		},
	},
});

export default queryClient;
