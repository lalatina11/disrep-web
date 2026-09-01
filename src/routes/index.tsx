import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import {
	DisasterCard,
	DisasterCardSkeleton,
} from "#/components/disaster/disaster-card";
import MainLayout from "#/components/layouts/main-layout";
import UnexpectedError from "#/components/templates/unexpected-error";
import { getDisastersAction } from "#/lib/server-actions/disaster";
import type { DisasterReport } from "#/lib/types/disaster-types";

export const Route = createFileRoute("/")({
	loader: async () => {
		return getDisastersAction();
	},
	component: Home,
});

function Home() {
	const initialData = Route.useLoaderData();
	const { data, isLoading, isError, error, refetch } = useQuery<
		Array<DisasterReport>
	>({
		queryKey: ["disaster"],
		initialData,
	});

	if (isLoading) {
		return (
			<MainLayout>
				<main className="container mx-auto px-4 py-6">
					<div className="mb-6 flex flex-col gap-1">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">
							Laporan Bencana
						</h1>
						<p className="text-sm text-muted-foreground">
							Daftar laporan bencana dan status bantuan terkini
						</p>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
						{Array.from({ length: 12 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Static placeholder skeletons
							<DisasterCardSkeleton key={`skeleton-${i}`} />
						))}
					</div>
				</main>
			</MainLayout>
		);
	}

	if (isError) {
		const errorMessage =
			error instanceof Error ? error.message : "Gagal memuat laporan bencana";
		return (
			<MainLayout>
				<UnexpectedError
					error={new Error(errorMessage)}
					reset={() => refetch()}
					title="Gagal Memuat Laporan Bencana"
					description={errorMessage}
				/>
			</MainLayout>
		);
	}

	const reports = data ?? [];

	return (
		<MainLayout>
			<main className="container mx-auto px-4 py-6">
				<div className="mb-6 flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Laporan Bencana
					</h1>
					<p className="text-sm text-muted-foreground">
						Daftar laporan bencana dan status bantuan terkini
					</p>
				</div>

				{reports.length === 0 ? (
					<div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
						<div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
							<AlertCircle className="size-7" />
						</div>
						<h2 className="mt-4 text-base font-semibold text-foreground">
							Belum Ada Laporan Bencana
						</h2>
						<p className="mt-1 max-w-sm text-sm text-muted-foreground">
							Saat ini belum ada laporan bencana yang terdaftar di dalam sistem.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
						{reports.map((report) => (
							<DisasterCard key={report.disaster.id} report={report} />
						))}
					</div>
				)}
			</main>
		</MainLayout>
	);
}
