import { createFileRoute, Link } from "@tanstack/react-router";
import { ModeToggle } from "#/components/provider/mode-toggle";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
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
		</div>
	);
}
