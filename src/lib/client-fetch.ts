import ky from "ky";
import { refreshTokenAction, signOutAction } from "./server-actions/auth";
import type { ApiResponseType, User } from "./types";
import { ErrorType } from "./types/enums";

type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

let refreshPromise: Promise<ApiResponseType<User | null>> | null = null;

const clientFetch = async <T>(
	path: string,
	method: HttpMethod,
	body?: Record<string, unknown>,
	isRetry = false,
): Promise<T> => {
	const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;

	try {
		const res = await ky.post("/api/request", {
			json: {
				path: sanitizedPath,
				method,
				body: body ?? undefined,
			},
			throwHttpErrors: false,
		});

		const result = (await res.json()) as ApiResponseType<T>;

		const isUnauthorized =
			res.status === 401 ||
			(!result.success && result.message === ErrorType.UNAUTHORIZED);

		if (isUnauthorized) {
			if (isRetry) {
				await signOutAction();
				if (typeof window !== "undefined") {
					window.location.replace("/auth/sign-in");
				}
				return result.data;
			}

			if (!refreshPromise) {
				refreshPromise = refreshTokenAction().finally(() => {
					refreshPromise = null;
				});
			}

			const refreshResult = await refreshPromise;

			if (!refreshResult.success) {
				await signOutAction();
				if (typeof window !== "undefined") {
					window.location.replace("/auth/sign-in");
				}
				return result.data;
			}

			return clientFetch<T>(sanitizedPath, method, body, true);
		}

		return result.data;
	} catch (error) {
		console.error("clientFetch error:", error);
		return null as unknown as T;
	}
};

export default clientFetch;
