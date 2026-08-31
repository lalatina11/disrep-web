import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import SignOutForm from "#/components/forms/auth-form/sign-out-form";
import MainLayout from "#/components/layouts/main-layout";
import { ModeToggle } from "#/components/mode-toggle";
import { Button } from "#/components/ui/button";
import useUserStore from "#/lib/stores/use-user-store";
import type { DisasterReport } from "#/lib/types/disaster-types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { user } = useUserStore();

	const { data } = useQuery<Array<DisasterReport>>({
		queryKey: ["disaster"],
	});

	console.log({ data });

	return (
		<MainLayout>
			<div className="p-8">
				<h1 className="text-4xl font-bold">Selamat Datang di Disrep</h1>
				<Button asChild>
					<Link to="/auth/sign-in">Masuk</Link>
				</Button>
				<Button variant={"default"}>Uji Coba</Button>
				<ModeToggle />
				{user && <SignOutForm />}
			</div>
		</MainLayout>
	);
}
