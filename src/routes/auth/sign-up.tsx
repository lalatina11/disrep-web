import { createFileRoute, Link } from "@tanstack/react-router";
import SignUpForm from "#/components/forms/auth-form/sign-up-form";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/auth/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Card className="w-sm">
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>Sign Up your account</CardDescription>
			</CardHeader>
			<CardContent>
				<SignUpForm />
			</CardContent>
			<CardFooter>
				Already Have an account?{" "}
				<Button variant="link" asChild>
					<Link to="/auth/sign-in">Sign In</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
