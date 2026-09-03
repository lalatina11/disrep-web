import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ADMIN_ROLES, type AdminRoleType } from "../constatns/user-role";
import type { User } from "../types";

interface UseUserStore {
	user: User | null;
	setUser: (u: User) => void;
	clearUser: () => void;
	isAdmin: () => boolean;
}

const useUserStore = create(
	persist<UseUserStore>(
		(set, get) => ({
			user: null,
			clearUser: () => set({ user: null }),
			setUser: (user) => set({ user }),
			isAdmin: () => {
				const { user } = get();
				if (!user) {
					return false;
				}
				return ADMIN_ROLES.includes(user.role as AdminRoleType);
			},
		}),
		{
			name: "use-user-store",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

export default useUserStore;
