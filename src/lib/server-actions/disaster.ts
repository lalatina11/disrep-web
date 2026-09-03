import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import type { ApiResponseType, DisasterReport } from "#/lib/types";
import { CookieType } from "#/lib/types/enums";

export const getDisastersAction = createServerFn({ method: "GET" }).handler(
	async (): Promise<DisasterReport[]> => {
		const token = getCookie(CookieType.ACCESS_TOKEN) || "";
		try {
			const res = await fetch(`${process.env.API_BASE_URL}/api/disaster`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					accept: "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			});

			const response = (await res.json()) as ApiResponseType<DisasterReport[]>;
			if (response.success && response.data) {
				return response.data;
			}
			return (response as unknown as DisasterReport[]) || [];
		} catch (error) {
			console.error("Error in getDisastersAction:", error);
			return [];
		}
	},
);

export const getDisasterByIdAction = createServerFn({ method: "GET" })
	.validator((id: string) => id)
	.handler(async ({ data: id }): Promise<DisasterReport | null> => {
		const token = getCookie(CookieType.ACCESS_TOKEN) || "";
		try {
			const res = await fetch(
				`${process.env.API_BASE_URL}/api/disaster/${id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						accept: "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				},
			);

			const response = (await res.json()) as ApiResponseType<DisasterReport>;
			if (response.success && response.data) {
				return response.data;
			}
			return (response as unknown as DisasterReport) || null;
		} catch (error) {
			console.error("Error in getDisasterByIdAction:", error);
			return null;
		}
	});
