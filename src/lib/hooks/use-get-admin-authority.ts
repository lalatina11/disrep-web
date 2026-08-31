import { useQuery } from "@tanstack/react-query";
import { ADMIN_ROLES, type UserRoleType } from "../constatns/user-role";
import { getUserAction } from "../server-actions/auth";

const useGetAdminAuthority = () => {
	return useQuery({
		queryKey: ["current-user"],
		queryFn: async () => {
			const res = await getUserAction();

			if (res.success && res.data !== null) {
				const isAdmin = ADMIN_ROLES.includes(
					res.data.role as UserRoleType.ADMIN | UserRoleType.SUPERADMIN,
				);
				if (isAdmin) {
					return true;
				}
			}
			return false;
		},
	});
};

export default useGetAdminAuthority;
