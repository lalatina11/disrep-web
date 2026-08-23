import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/auth/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Card className="w-sm">
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>Sign In into your account</CardDescription>
			</CardHeader>
		</Card>
	);
}
