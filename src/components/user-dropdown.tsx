import { Link } from "@tanstack/react-router";
import { Plus, Shield, User } from "lucide-react";
import { ADMIN_ROLES, type AdminRoleType } from "#/lib/constatns/user-role";
import useUserStore from "#/lib/stores/use-user-store";
import SignOutForm from "./forms/auth-form/sign-out-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

const UserDropdown = () => {
	const { user } = useUserStore();

	if (!user) return null;

	const isAdmin = ADMIN_ROLES.includes(user.role as AdminRoleType);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>
					<User />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-2xs">
				<div className="flex flex-col items-center">
					<Avatar>
						<AvatarImage src={user.avatar} />
						<AvatarFallback>
							<User />
						</AvatarFallback>
					</Avatar>
					<div className="flex gap-1 items-center">
						{isAdmin && (
							<Badge>
								<Shield />
							</Badge>
						)}
						<span>{user.display_name}</span>
					</div>
				</div>
				<Separator className="my-2" />
				<div className="flex flex-col gap-1">
					<Button variant={"secondary"} asChild className="w-full">
						<Link to="/disaster/create">
							<Plus />
							Laporkan Banjir
						</Link>
					</Button>
					<SignOutForm className="w-full" />
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserDropdown;
