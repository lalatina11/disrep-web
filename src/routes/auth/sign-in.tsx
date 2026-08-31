import { createFileRoute, Link } from "@tanstack/react-router";
import SignInForm from "#/components/forms/auth-form/sign-in-form";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
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
				<CardTitle>Masuk</CardTitle>
				<CardDescription>Masuk ke akun Anda</CardDescription>
			</CardHeader>
			<CardContent>
				<SignInForm />
			</CardContent>
			<CardFooter>
				Belum punya akun?{" "}
				<Button variant="link" asChild>
					<Link to="/auth/sign-up">Daftar</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

