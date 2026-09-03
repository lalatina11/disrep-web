import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, Plus, Shield, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Spinner } from "./ui/spinner";
import { signOutAction } from "#/lib/server-actions/auth";
import useUserStore from "#/lib/stores/use-user-store";

const UserDropdown = () => {
	const { user, isAdmin, clearUser } = useUserStore();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const { pathname } = useLocation();
	const navigate = useNavigate();

	if (!user) return null;

	const handleLogOut = async () => {
		setIsLoggingOut(true);
		try {
			await signOutAction();
			clearUser();
			toast.success("Berhasil keluar!");
			if (pathname !== "/") {
				navigate({ to: "/auth/sign-in" });
			}
		} catch (error) {
			console.error("Sign out error:", error);
			toast.error("Gagal keluar dari akun");
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-muted"
				>
					<Avatar className="size-8 ring-1 ring-border">
						<AvatarImage src={user.avatar} alt={user.display_name} />
						<AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
							{user.display_name?.slice(0, 2).toUpperCase() || "US"}
						</AvatarFallback>
					</Avatar>
					<span className="hidden max-w-[120px] truncate text-xs font-medium text-foreground sm:inline-block">
						{user.display_name}
					</span>
					<ChevronDown className="size-3 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="end" sideOffset={8}>
				{/* User Profile Header */}
				<DropdownMenuLabel className="p-2 font-normal">
					<div className="flex flex-col space-y-1">
						<div className="flex items-center gap-1.5">
							<p className="truncate text-sm font-semibold leading-none text-foreground">
								{user.display_name}
							</p>
							{isAdmin() && (
								<Badge
									variant="secondary"
									className="px-1 py-0 text-[10px] font-medium"
								>
									<Shield className="mr-0.5 size-2.5 text-primary" />
									Admin
								</Badge>
							)}
						</div>
						<p className="truncate text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Navigation Links */}
				<DropdownMenuGroup>
					<DropdownMenuItem asChild className="cursor-pointer">
						<Link to="/profile" className="flex items-center gap-2">
							<User className="size-4" />
							<span>Profil Saya</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className="cursor-pointer">
						<Link to="/disaster/create" className="flex items-center gap-2">
							<Plus className="size-4" />
							<span>Laporkan Bencana</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Logout Action */}
				<DropdownMenuItem
					variant="destructive"
					onClick={handleLogOut}
					disabled={isLoggingOut}
					className="flex cursor-pointer items-center gap-2"
				>
					{isLoggingOut ? (
						<Spinner className="size-4" />
					) : (
						<LogOut className="size-4" />
					)}
					<span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserDropdown;
