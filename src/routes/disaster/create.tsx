import { createFileRoute } from "@tanstack/react-router";
import MainLayout from "#/components/layouts/main-layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/disaster/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<MainLayout className="flex flex-col gap-3">
			<Card className="m-3">
				<CardHeader>
					<CardTitle>Buat Laporan Bencana</CardTitle>
					<CardDescription>Buat Laporan Bencana Baru</CardDescription>
				</CardHeader>
				<CardContent></CardContent>
				<CardFooter>
					<span>Tips:</span>
					<span>
						1. Opsi anonymous membuat informasi pelapor tidak ditampilkan
					</span>
				</CardFooter>
			</Card>
		</MainLayout>
	);
}
