export enum CookieType {
	ACCESS_TOKEN = "access_token",
	REFRESH_TOKEN = "refresh_token",
}

export enum ErrorType {
	UNAUTHORIZED = "Unauthorized",
}

export enum DisasterStatus {
	PENDING = "pending",
	NEW = "new",
	AID_DISPATCHED = "aid_dispatched",
	AID_ARRIVED = "aid_arrived",
	RESOLVED = "resolved",
}

export type DisasterStatusType =
	| "pending"
	| "new"
	| "aid_dispatched"
	| "aid_arrived"
	| "resolved";

