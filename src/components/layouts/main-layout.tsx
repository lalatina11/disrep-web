import type { ReactNode } from "react";
import { cn } from "#/lib/utils";
import MainNavbar from "../navbars/main-navbar";

interface Props {
	children: ReactNode;
	className?: string;
}
const MainLayout = (props: Props) => {
	return (
		<div
			className={cn(
				"flex flex-col gap-4 min-h-screen",
				props.className && props.className,
			)}
		>
			<MainNavbar />
			{props.children}
		</div>
	);
};

export default MainLayout;
