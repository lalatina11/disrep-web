import { User } from "lucide-react";
import useUserStore from "#/lib/stores/use-user-store";
import SignOutForm from "./forms/auth-form/sign-out-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
					<span>{user.display_name}</span>
				</div>
				<Separator className="my-2" />
				<SignOutForm className="w-full" />
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserDropdown;
