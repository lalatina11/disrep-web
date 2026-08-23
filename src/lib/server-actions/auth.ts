import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import type { ApiResponseType, AuthResponseType, User } from "../types";
import { signUpSchema } from "../validations/auth";

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

			setCookie("access_token", response.data.token.access_token, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: ONE_DAY,
				secure: process.env.APP_ENV === "production",
			});
			setCookie("refresh_token", response.data.token.refresh_token, {
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
