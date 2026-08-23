import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
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
			<CardFooter>
				Already Have an account?{" "}
				<Button variant="link" asChild>
					<Link to="/auth/sign-up">Sign Up</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
