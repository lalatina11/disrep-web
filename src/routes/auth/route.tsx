import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col justify-center items-center min-h-screen">
			<Outlet />
		</div>
	);
}
