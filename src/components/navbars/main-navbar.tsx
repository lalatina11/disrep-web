import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import useUserStore from "#/lib/stores/use-user-store";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import UserDropdown from "../user-dropdown";

const MainNavbar = () => {
	const { user } = useUserStore();
	return (
		<header className="flex p-4 justify-between items-center bg-card">
			<Link to="/" className="flex flex-col">
				<h1 className="text-2xl font-semibold">Disrep</h1>
				<h2 className="text-xs underline underline-offset-4">
					Disaster Report System
				</h2>
			</Link>
			{user ? (
				<div className="flex gap-2 items-center">
					<ModeToggle />
					<UserDropdown />
				</div>
			) : (
				<Button asChild>
					<Link to="/auth/sign-in">
						<LogIn />
					</Link>
				</Button>
			)}
		</header>
	);
};

export default MainNavbar;
