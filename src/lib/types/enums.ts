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

export const DISASTER_STATUS_LIST: Array<DisasterStatus> = [
	DisasterStatus.PENDING,
	DisasterStatus.NEW,
	DisasterStatus.AID_DISPATCHED,
	DisasterStatus.AID_ARRIVED,
	DisasterStatus.RESOLVED,
];

export type DisasterStatusType =
	| "pending"
	| "new"
	| "aid_dispatched"
	| "aid_arrived"
	| "resolved";
