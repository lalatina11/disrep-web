export enum UserRoleType {
	USER = "user",
	ADMIN = "admin",
	SUPERADMIN = "superadmin",
}

export const USER_ROLES = [
	UserRoleType.USER,
	UserRoleType.ADMIN,
	UserRoleType.SUPERADMIN,
] as const;

export const ADMIN_ROLES = USER_ROLES.filter((r) => r !== UserRoleType.USER);
