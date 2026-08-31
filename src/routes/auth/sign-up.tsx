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
				<CardTitle>Daftar</CardTitle>
				<CardDescription>Daftarkan akun baru Anda</CardDescription>
			</CardHeader>
			<CardContent>
				<SignUpForm />
			</CardContent>
			<CardFooter>
				Sudah punya akun?{" "}
				<Button variant="link" asChild>
					<Link to="/auth/sign-in">Masuk</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
