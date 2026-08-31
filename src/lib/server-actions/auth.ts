import { createServerFn } from "@tanstack/react-start";
import {
	deleteCookie,
	getCookie,
	setCookie,
} from "@tanstack/react-start/server";
import type { ApiResponseType, AuthResponseType, User } from "../types";
import { CookieType } from "../types/enums";
import { signInSchema, signUpSchema } from "../validations/auth";

const ONE_DAY = 60 * 60 * 24;
const SEVEN_DAY = 7 * 60 * 60 * 24;

export const signUpAction = createServerFn({ method: "POST" })
	.validator(signUpSchema)
	.handler(async ({ data }): Promise<ApiResponseType<User | null>> => {
		try {
			const res = await fetch(`${process.env.API_BASE_URL}/api/auth/sign-up`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					accept: "application/json",
				},
				body: JSON.stringify(data),
			});
			const response = (await res.json()) as ApiResponseType<AuthResponseType>;
			if (!response.success) {
				return { success: false, message: response.message, data: null };
			}

			setCookie(CookieType.ACCESS_TOKEN, response.data.token.access_token, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: ONE_DAY,
				secure: process.env.APP_ENV === "production",
			});
			setCookie(CookieType.REFRESH_TOKEN, response.data.token.refresh_token, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: SEVEN_DAY,
				secure: process.env.APP_ENV === "production",
			});

			return {
				success: true,
				message: "Pendaftaran berhasil",
				data: response.data.user,
			};
		} catch (error) {
			console.log({ error });
			return { success: false, message: "Pendaftaran gagal", data: null };
		}
	});

export const signInAction = createServerFn({ method: "POST" })
	.validator(signInSchema)
	.handler(async ({ data }): Promise<ApiResponseType<User | null>> => {
		try {
			const res = await fetch(`${process.env.API_BASE_URL}/api/auth/sign-in`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					accept: "application/json",
				},
				body: JSON.stringify(data),
			});
			const response = (await res.json()) as ApiResponseType<AuthResponseType>;
			if (!response.success) {
				return { success: false, message: response.message, data: null };
			}

			setCookie(CookieType.ACCESS_TOKEN, response.data.token.access_token, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: ONE_DAY,
				secure: process.env.APP_ENV === "production",
			});
			setCookie(CookieType.REFRESH_TOKEN, response.data.token.refresh_token, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: SEVEN_DAY,
				secure: process.env.APP_ENV === "production",
			});

			return {
				success: true,
				message: "Login berhasil",
				data: response.data.user,
			};
		} catch (error) {
			console.log({ error });
			return { success: false, message: "Login gagal", data: null };
		}
	});

export const signOutAction = createServerFn({ method: "POST" }).handler(
	async () => {
		const token = getCookie(CookieType.ACCESS_TOKEN) || "";
		try {
			const res = await fetch(`${process.env.API_BASE_URL}/api/auth/sign-out`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(await res.json());
		} catch (err) {
			console.log({ err });
		}
		deleteCookie(CookieType.ACCESS_TOKEN, { path: "/" });
		deleteCookie(CookieType.REFRESH_TOKEN, { path: "/" });
	},
);

export const refreshTokenAction = createServerFn({ method: "POST" }).handler(
	async () => {
		const refresh_token = getCookie(CookieType.REFRESH_TOKEN) || "";
		try {
			const res = await fetch(
				`${process.env.API_BASE_URL}/api/auth/refresh-token`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						accept: "application/json",
					},
					body: JSON.stringify({ refresh_token }),
				},
			);
			const response = (await res.json()) as ApiResponseType<AuthResponseType>;
			if (!response.success) {
				return { success: false, message: response.message, data: null };
			}

			setCookie(CookieType.ACCESS_TOKEN, response.data.token.access_token, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: ONE_DAY,
				secure: process.env.APP_ENV === "production",
			});
			setCookie(CookieType.REFRESH_TOKEN, response.data.token.refresh_token, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: SEVEN_DAY,
				secure: process.env.APP_ENV === "production",
			});

			return {
				success: true,
				message: "Refresh token berhasil",
				data: response.data.user,
			};
		} catch (error) {
			console.log({ error });
			return { success: false, message: "Refresh token gagal", data: null };
		}
	},
);
