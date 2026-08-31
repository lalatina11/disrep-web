import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import queryClient from "#/lib/query-client";

const QueryClientProvider = () => {
	return (
		<TanstackQueryClientProvider client={queryClient}>
			QueryClientProvider
		</TanstackQueryClientProvider>
	);
};

export default QueryClientProvider;
