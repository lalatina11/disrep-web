// {"disaster":{"id":"8094fc73-238e-48f9-aafe-fe85ee35c819","user_id":"ba07bb55-72a9-4806-b485-066e4117556b","title":"Kebakaran Hutan","description":"Kebakaran Hutan lurr","street":"Jalan Jenderal Sudirman","city":"purwokerto","lat":-7.4243772,"lng":109.2301616,"is_anon":false,"status":"aid_arrived","created_at":"2026-08-20T03:07:04.443099Z","updated_at":"2026-08-23T01:04:24.213875Z"},"attachments":[{"media_url":"http://127.0.0.1:54321/storage/v1/object/public/disaster_media/2026-08-20-02:54:13.880725933-da3b6167-2b90-45d5-b78d-50a48e1e92d9"},{"media_url":"http://127.0.0.1:54321/storage/v1/object/public/disaster_media/2026-08-20-02:54:32.301970275-df2e7572-33ae-4d07-b6c2-0643cdf318cd"}],"author":{"id":"ba07bb55-72a9-4806-b485-066e4117556b","email":"sumanto@admin.com","display_name":"Sumanto","role":"admin","avatar":"https://ui-avatars.com/api/?name=Sumanto","avatar_storage_url":null,"created_at":"2026-08-20T03:01:39.626961Z","updated_at":"2026-08-20T03:01:39.626961Z"},"aids":[{"id":"26e5363b-50cf-4052-9a7e-84c009b01e66","disaster_report_id":"8094fc73-238e-48f9-aafe-fe85ee35c819","items":[{"id":"81267dbd-48b6-4b81-b71a-4be0fbcc1a1f","disaster_report_aid_id":"26e5363b-50cf-4052-9a7e-84c009b01e66","item_name":"Beras","item_price":12000,"quantity":15}],"attachments":[{"id":"3e156741-c046-406e-a0cd-fa6e54a9f0e2","disaster_report_aid_id":"26e5363b-50cf-4052-9a7e-84c009b01e66","media_url":"disaster_media/2026-08-20-02:54:13.880725933-da3b6167-2b90-45d5-b78d-50a48e1e92d9"},{"id":"1973d341-7036-4b23-90e1-dcec398cf748","disaster_report_aid_id":"26e5363b-50cf-4052-9a7e-84c009b01e66","media_url":"disaster_media/2026-08-20-02:54:13.880725933-da3b6167-2b90-45d5-b78d-50a48e1e92d9"}]}]}

import type { DisasterStatusType } from "./enums";

export interface Disaster {
	id: string;
	user_id: string;
	title: string;
	description: string;
	street: string;
	city: string;
	lat: number;
	lng: number;
	is_anon: boolean;
	status: DisasterStatusType | string;
	created_at: string;
	updated_at: string;
}

export interface DisasterAttachment {
	media_url: string;
	media_type: string; //"image" or "video"
}

export interface DisasterAuthor {
	id: string;
	email: string;
	display_name: string;
	role: string;
	avatar: string;
	avatar_storage_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface DisasterAidItem {
	id: string;
	disaster_report_aid_id: string;
	item_name: string;
	item_price: number;
	quantity: number;
}

export interface DisasterAidAttachment {
	id: string;
	disaster_report_aid_id: string;
	media_url: string;
	media_type: string; //"image" or "video"
}

export interface DisasterAid {
	id: string;
	disaster_report_id: string;
	items: DisasterAidItem[];
	attachments: DisasterAidAttachment[];
}

export interface DisasterReport {
	disaster: Disaster;
	attachments: DisasterAttachment[];
	author: DisasterAuthor;
	aids: DisasterAid[];
}
