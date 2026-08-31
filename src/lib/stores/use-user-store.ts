import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "../types";

interface UseUserStore {
	user: User | null;
	setUser: (u: User) => void;
	clearUser: () => void;
}

const useUserStore = create(
	persist<UseUserStore>(
		(set) => ({
			user: null,
			clearUser: () => set({ user: null }),
			setUser: (user) => set({ user }),
		}),
		{
			name: "use-user-store",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

export default useUserStore;
