import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import clientFetch from "#/lib/client-fetch";

interface Props {
	children: ReactNode;
}

const SwrProvider = (props: Props) => {
	return (
		<SWRConfig value={{ fetcher: clientFetch }}>{props.children}</SWRConfig>
	);
};

export default SwrProvider;
