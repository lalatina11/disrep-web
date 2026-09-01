export interface ApiResponseType<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface User {
	id: string;
	display_name: string;
	email: string;
	avatar: string;
	role: string;
	created_at: string;
	updated_at: string;
}

export interface AuthResponseType {
	token: {
		access_token: string;
		refresh_token: string;
	};
	user: User;
}

export * from "./disaster-types";
export * from "./enums";

export interface FileUploadResult {
	media_url: string;
	media_type: string; // image or video
	media_preview: string; // image or video
}
