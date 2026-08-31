import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import queryClient from "#/lib/query-client";

interface Props {
	children: ReactNode;
}

const QueryClientProvider = (props: Props) => {
	return (
		<TanstackQueryClientProvider client={queryClient}>
			{props.children}
		</TanstackQueryClientProvider>
	);
};

export default QueryClientProvider;
