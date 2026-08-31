import { useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Spinner } from "#/components/ui/spinner";
import { signOutAction } from "#/lib/server-actions/auth";

const SignOutForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { pathname } = useLocation();
	const nav = useNavigate();

	async function handleLogOut() {
		setIsLoading(true);
		await signOutAction();
		setIsLoading(false);
		if (pathname !== "/") {
			nav({ to: "/auth/sign-in" });
		}
	}

	return (
		<Button onClick={handleLogOut} disabled={isLoading} variant={"destructive"}>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<LogOut /> Logout
				</>
			)}
		</Button>
	);
};

export default SignOutForm;
