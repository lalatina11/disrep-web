import { Shield, User } from "lucide-react";
import useGetAdminAuthority from "#/lib/hooks/use-get-admin-authority";
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
	const { data: isAdmin, isLoading } = useGetAdminAuthority();

	if (!user || isLoading) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>
					<User />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<div className="flex gap-2 items-center">
					<Avatar>
						<AvatarImage src={user.avatar} />
						<AvatarFallback>
							<User />
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span>{user.display_name}</span>
						{isAdmin && (
							<Badge>
								<Shield />
							</Badge>
						)}
					</div>
				</div>
				<Separator className="my-2" />
				<SignOutForm className="w-full" />
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserDropdown;
