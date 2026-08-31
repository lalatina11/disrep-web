import { createFileRoute } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";
import { CookieType } from "#/lib/types/enums";

export const Route = createFileRoute("/api/request/")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const access_token = getCookie(CookieType.ACCESS_TOKEN);
				const { method, path, body } = await request.json();
				const res = await fetch(`${process.env.API_BASE_URL}/api/${path}`, {
					headers: {
						"Content-Type": "application/json",
						accept: "application/json",
						Authorization: `Bearer ${access_token}`,
					},
					method,
					body: body ? JSON.stringify(body) : undefined,
				});
				const result = await res.json();
				return Response.json(result, { status: res.status });
			},
		},
	},
});
