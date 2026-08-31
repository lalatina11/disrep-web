import { createFileRoute, Link } from "@tanstack/react-router";
import SignOutForm from "#/components/forms/auth-form/sign-out-form";
import { ModeToggle } from "#/components/provider/mode-toggle";
import { Button } from "#/components/ui/button";
import useUserStore from "#/lib/stores/use-user-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { user } = useUserStore();
	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
			<p className="mt-4 text-lg">
				Edit <code>src/routes/index.tsx</code> to get started.
			</p>
			<Button asChild>
				<Link to="/auth/sign-in">Sign In</Link>
			</Button>
			<Button variant={"default"}>Test</Button>
			<ModeToggle />
			{user && <SignOutForm />}
		</div>
	);
}
