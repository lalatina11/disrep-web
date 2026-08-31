import type { ReactNode } from "react";
import MainNavbar from "../navbars/main-navbar";

interface Props {
	children: ReactNode;
}
const MainLayout = (props: Props) => {
	return (
		<div className="flex flex-col gap-4 min-h-screen">
			<MainNavbar />
			{props.children}
		</div>
	);
};

export default MainLayout;
