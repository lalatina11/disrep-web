import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import SignOutForm from "#/components/forms/auth-form/sign-out-form";
import { ModeToggle } from "#/components/mode-toggle";
import { Button } from "#/components/ui/button";
import useUserStore from "#/lib/stores/use-user-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { user } = useUserStore();

	const { data } = useQuery({
		queryKey: ["disaster"],
	});

	console.log({ data });

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Selamat Datang di Disrep</h1>
			<p className="mt-4 text-lg">
				Ubah <code>src/routes/index.tsx</code> untuk memulai.
			</p>
			<Button asChild>
				<Link to="/auth/sign-in">Masuk</Link>
			</Button>
			<Button variant={"default"}>Uji Coba</Button>
			<ModeToggle />
			{user && <SignOutForm />}
		</div>
	);
}
