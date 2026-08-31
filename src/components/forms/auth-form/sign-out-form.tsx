import { useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Spinner } from "#/components/ui/spinner";
import { signOutAction } from "#/lib/server-actions/auth";
import useUserStore from "#/lib/stores/use-user-store";

const SignOutForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { pathname } = useLocation();
	const { clearUser } = useUserStore();
	const nav = useNavigate();

	async function handleLogOut() {
		setIsLoading(true);
		await signOutAction();
		clearUser();
		setIsLoading(false);
		toast.success("Logout Berhasil!");
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
